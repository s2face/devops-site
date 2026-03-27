# Linux File System and Archives: Technical Base

This document provides the technical foundation, command references, and configurations for Lesson 5: "Linux File System and Archives".

---

## 1. Filesystem Hierarchy Standard (FHS)

The Linux filesystem is organized in a tree-like structure starting from the root `/`. Understanding the FHS is critical for knowing where to find configurations, logs, and binaries.

| Directory | Purpose | Typical Content |
| :--- | :--- | :--- |
| `/bin` | Essential Command Binaries | Binaries required for single-user mode and basic system repair (e.g., `ls`, `cp`, `cat`). |
| `/etc` | Host-specific System Configuration | Configuration files for the system and installed applications (e.g., `passwd`, `fstab`, `hosts`). |
| `/var` | Variable Data Files | Files that change frequently during system operation: logs (`/var/log`), caches (`/var/cache`), and mail. |
| `/tmp` | Temporary Files | Files that are not expected to survive a reboot. Usually cleared on startup. |
| `/home` | User Home Directories | Personal storage for users (e.g., `/home/alice`, `/home/bob`). |
| `/usr` | User Utilities and Read-only Data | The largest directory; contains user binaries (`/usr/bin`), libraries (`/usr/lib`), and documentation. |
| `/proc` | Process Information Pseudo-filesystem | A virtual filesystem providing an interface to kernel data structures (e.g., `/proc/cpuinfo`, `/proc/meminfo`). |
| `/sys` | System Information Pseudo-filesystem | A virtual filesystem that provides information about hardware devices and drivers. |

---

## 2. Disk Space and Block Devices

### Monitoring Disk Space
- `df -h`: Displays the amount of disk space available on file systems in human-readable format.
- `du -sh <path>`: Estimates file space usage for a specific directory or file.

```bash
# Check free space on all mounted filesystems
df -h

# Check the size of all items in /var
sudo du -sh /var/*
```

### Managing Block Devices
- `lsblk`: Lists information about all available or the specified block devices in a tree-like format.
- `fdisk -l`: Lists the partition tables for the specified devices.

```bash
# List all block devices
lsblk

# Detailed partition info (requires sudo)
sudo fdisk -l
```

---

## 3. Mounting File Systems

Mounting is the process of attaching a filesystem to a specific point in the directory tree.

### Manual Mounting
```bash
# Mount a partition to a directory
sudo mount /dev/sdb1 /mnt/data

# Unmount a filesystem
sudo umount /mnt/data
```

### Persistent Mounting: `/etc/fstab`
The `/etc/fstab` file contains information about where partitions and storage devices should be mounted and how.

**Example entry in `/etc/fstab`:**
```text
# <file system> <mount point>   <type>  <options>       <dump>  <pass>
UUID=b3e1...    /data           ext4    defaults        0       2
```

---

## 4. Archives and Compression

### Tar Flags Cheat Sheet
| Flag | Description |
| :--- | :--- |
| `-c` | Create a new archive |
| `-x` | Extract files from an archive |
| `-v` | Verbosely list files processed |
| `-f` | Use archive file (must be the last flag before the filename) |
| `-z` | Filter the archive through `gzip` (.tar.gz) |
| `-j` | Filter the archive through `bzip2` (.tar.bz2) |
| `-t` | List the contents of an archive |

### Creation and Extraction
```bash
# Create a gzipped tarball
tar -czvf backup.tar.gz /path/to/directory

# Extract a gzipped tarball
tar -xzvf backup.tar.gz

# Using zip (standard for cross-platform)
zip -r archive.zip /path/to/directory
unzip archive.zip
```

---

## 5. Synchronization with `rsync`

`rsync` is a fast and versatile file copying tool that can synchronize files locally or across a network.

```bash
# Basic local synchronization
rsync -av --progress /src/directory/ /dest/directory/

# Sync to a remote server
rsync -avz -e ssh /local/path/ user@remote:/remote/path/
```
*Note: The trailing slash on the source directory tells rsync to copy the contents of the directory, not the directory itself.*

---

## 6. Symbolic and Hard Links

- **Hard Link (`ln`)**: A pointer to the physical data on the disk (inode). Cannot span filesystems.
- **Symbolic Link (`ln -s`)**: A shortcut to another path. Can span filesystems.

```bash
# Create a symbolic link
ln -s /etc/nginx/nginx.conf ~/my_config.conf

# Create a hard link
ln /path/to/file hardlink_to_file
```

---

## 7. Practical Practice: Automated Backup Script

A common DevOps task is creating a rotation-based backup of a critical directory.

```bash
#!/bin/bash

# Configuration
SOURCE_DIR="/var/www/html"
BACKUP_DIR="/opt/backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_NAME="site_backup_$TIMESTAMP.tar.gz"

# Ensure backup directory exists
mkdir -p "$BACKUP_DIR"

# Create compressed archive
echo "Starting backup of $SOURCE_DIR..."
tar -czf "$BACKUP_DIR/$BACKUP_NAME" "$SOURCE_DIR"

# Verify integrity
if [ $? -eq 0 ]; then
    echo "Backup successful: $BACKUP_DIR/$BACKUP_NAME"
else
    echo "Backup failed!" >&2
    exit 1
fi

# Retention: Remove backups older than 7 days
find "$BACKUP_DIR" -type f -name "*.tar.gz" -mtime +7 -delete
echo "Old backups cleaned up."
```
