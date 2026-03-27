# Lesson 02: Installing and Configuring Ubuntu Server 22.04 LTS

## 1. Technical Specifications

For this lesson, we will use the following virtual machine configuration in VirtualBox:

| Parameter | Value |
|-----------|-------|
| **Operating System** | Ubuntu Server 22.04 LTS (Jammy Jellyfish) |
| **vCPU** | 2 Cores |
| **RAM** | 2 GB |
| **Storage (HDD/SSD)** | 20 GB (Dynamic allocation recommended) |
| **Network** | Bridged Adapter (to access from host) or NAT with Port Forwarding |
| **Virtualization** | VirtualBox 7.x |

### Recommended ISO
Download the official ISO from: [Ubuntu Server 22.04.x LTS](https://ubuntu.com/download/server)

---

## 2. Step-by-Step Technical Guide (CLI Focus)

### Phase 1: VirtualBox VM Preparation
1. **New VM**: Name it `ubuntu-server-2204`, Type: `Linux`, Version: `Ubuntu (64-bit)`.
2. **Hardware**: Set RAM to `2048 MB` and Processors to `2`.
3. **Hard Disk**: Create a Virtual Hard Disk (`VDI`), size `20 GB`.
4. **Network Settings**: 
   - Go to `Settings` > `Network`.
   - Change `Attached to` to `Bridged Adapter` (this allows the VM to get an IP from your local router).
5. **Storage**: Mount the downloaded ISO in the `Controller: IDE`.

### Phase 2: Ubuntu Server Installation
1. **Boot**: Start the VM and select "Try or Install Ubuntu Server".
2. **Language**: Choose your preferred language (e.g., English).
3. **Keyboard**: Select your layout.
4. **Type of Install**: Choose "Ubuntu Server" (not minimized, for better out-of-the-box experience).
5. **Network**: The installer will attempt DHCP. Note the IP address if shown.
6. **Storage Configuration**:
   - Use "Use an entire disk".
   - Uncheck "Set up this disk as an LVM group" unless you specifically need LVM (keeping it simple for beginners).
7. **Profile Setup**:
   - Your name: `DevOps Admin`
   - Your server's name: `ubuntu-server`
   - Pick a username: `devopsuser`
   - Choose a password: `[SecurePassword]`
8. **SSH Setup**: Check "Install OpenSSH server".
9. **Featured Snaps**: Skip (press Done).
10. **Finish**: Wait for installation and select "Reboot Now". Remember to unmount the ISO.

---

## 3. Post-Installation Configuration (Code Snippets)

### System Update
Always start by ensuring your package list and installed packages are up to date.
```bash
# Refresh the local package index
sudo apt update

# Upgrade all installed packages to their latest versions
sudo apt upgrade -y

# Optional: Remove unnecessary packages
sudo apt autoremove -y
```

### Hostname Configuration
To change or verify your server's hostname:
```bash
# Set the hostname to 'devops-server'
sudo hostnamectl set-hostname devops-server

# Verify the change
hostnamectl
```

### User Creation and Sudo Privileges
If you need to add another team member or service user:
```bash
# Create a new user named 'deploy'
sudo adduser deploy

# Add the user to the 'sudo' group to grant administrative privileges
sudo usermod -aG sudo deploy

# Verify sudo access for the new user
su - deploy -c "sudo whoami"
```

### SSH Server Management
Ensure SSH is installed, running, and enabled to start on boot.
```bash
# Install OpenSSH Server if not done during installation
sudo apt install -y openssh-server

# Enable and start the service
sudo systemctl enable --now ssh

# Check the service status
sudo systemctl status ssh

# Allow SSH through the UFW firewall (if active)
sudo ufw allow ssh
```

### Basic Network Configuration (Netplan)
Ubuntu 22.04 uses `Netplan`. To set a static IP, edit the configuration file (usually found in `/etc/netplan/`).

Example for `/etc/netplan/00-installer-config.yaml`:
```yaml
network:
  version: 2
  renderer: networkd
  ethernets:
    enp0s3: # Replace with your interface name (check 'ip link')
      dhcp4: no
      addresses:
        - 192.168.1.50/24
      routes:
        - to: default
          via: 192.168.1.1
      nameservers:
        addresses: [8.8.8.8, 1.1.1.1]
```
Apply the configuration:
```bash
# Test the configuration (recommended to avoid lockouts)
sudo netplan try

# Apply the configuration
sudo netplan apply
```

---

## 4. Troubleshooting Common Issues

### Issue 1: VT-x/AMD-V is Not Available
*   **Symptom**: VirtualBox fails to start the VM or says "64-bit guest is not supported".
*   **Solution**: 
    1. Enter your host computer's BIOS/UEFI.
    2. Look for "Intel Virtualization Technology" or "SVM Mode" (AMD).
    3. Set it to **Enabled**.
    4. In Windows, disable "Hyper-V" features if they conflict with VirtualBox.

### Issue 2: Network Bridge Not Working
*   **Symptom**: The VM cannot get an IP address or access the internet.
*   **Solution**:
    1. Ensure your host machine is connected to the network via Ethernet or Wi-Fi.
    2. In VirtualBox Settings > Network, ensure the correct physical adapter is selected for the Bridge.
    3. If Bridge fails, use **NAT** and set up **Port Forwarding** (Host Port 2222 -> Guest Port 22) to access SSH.

### Issue 3: "Failed to fetch" Errors during `apt update`
*   **Symptom**: Errors connecting to Ubuntu repositories.
*   **Solution**:
    1. Check DNS resolution: `ping google.com`.
    2. If DNS fails, check `/etc/resolv.conf` or your Netplan nameserver settings.
    3. Ensure the VM has an active internet connection (check `ip a`).
