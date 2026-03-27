# Technical Base: Linux User Management and Permissions

## 1. Core Concepts: UID, GID, and System Files

In Linux, every user and group is identified by a unique numerical ID.

- **UID (User ID):** A unique number assigned to each user. UID 0 is reserved for the `root` user.
- **GID (Group ID):** A unique number assigned to each group.

### Key Configuration Files
- `/etc/passwd`: Contains user account information (username, UID, GID, home directory, shell).
  - *Format:* `username:password_placeholder:UID:GID:gecos:home_dir:shell`
- `/etc/shadow`: Stores encrypted password information and password aging settings. Accessible only by root.
- `/etc/group`: Contains group information and lists members of each group.
  - *Format:* `group_name:password:GID:user_list`

---

## 2. User Management Commands

### Creating and Deleting Users
- **`useradd`**: Creates a new user.
  - `sudo useradd -m -s /bin/bash john`: Creates user `john`, generates a home directory (`-m`), and sets the default shell (`-s`).
- **`userdel`**: Deletes a user.
  - `sudo userdel -r john`: Deletes user `john` and removes their home directory (`-r`).

### Password Management
- **`passwd`**: Updates a user's password.
  - `sudo passwd john`: Interactively set or change the password for `john`.

---

## 3. Group Management

- **`groupadd`**: Creates a new group.
  - `sudo groupadd developers`: Creates a group named `developers`.
- **`usermod -aG`**: Adds a user to a supplementary group (the `-a` flag is crucial to *append* rather than replace).
  - `sudo usermod -aG developers john`: Adds `john` to the `developers` group.

---

## 4. File Permissions (rwx)

Permissions are divided into three scopes: **User (Owner)**, **Group**, and **Others**.

### Notation
- **r (read):** View file content or list directory.
- **w (write):** Modify file or add/remove files in a directory.
- **x (execute):** Run a file as a program or enter a directory.

### Numerical vs. Symbolic
| Permission | Numerical | Symbolic |
| :--- | :--- | :--- |
| Read | 4 | `r--` |
| Write | 2 | `-w-` |
| Execute | 1 | `--x` |
| Read + Write | 6 | `rw-` |
| Read + Execute | 5 | `r-x` |
| Read + Write + Execute | 7 | `rwx` |

---

## 5. Changing Permissions and Ownership

### `chmod` (Change Mode)
- **Symbolic:** `chmod u+x file.sh` (Add execute for user), `chmod g-w file.txt` (Remove write for group).
- **Numerical:** `chmod 644 file.txt` (Owner: rw, Group: r, Others: r).

### `chown` and `chgrp`
- **`chown`**: Change owner and/or group.
  - `sudo chown john:developers file.txt`: Sets owner to `john` and group to `developers`.
- **`chgrp`**: Change group only.
  - `sudo chgrp developers file.txt`.

---

## 6. Administrative Access: `sudo`

- **`sudo`**: Allows a permitted user to execute a command as the superuser or another user.
- **`/etc/sudoers`**: The configuration file for `sudo`.
  - **Warning:** Always use `visudo` to edit this file to prevent syntax errors that could lock you out.
  - *Example entry:* `john ALL=(ALL:ALL) ALL` (Allows `john` to run any command as any user).

---

## 7. Special Bits

- **SUID (Set User ID):** On an executable, it runs with the permissions of the file owner (e.g., `/usr/bin/passwd`).
  - *Setting:* `chmod u+s file` or `chmod 4755 file`.
- **SGID (Set Group ID):** On a directory, new files created inside inherit the group of the directory.
  - *Setting:* `chmod g+s dir` or `chmod 2755 dir`.
- **Sticky Bit:** On a directory, only the file owner can delete or rename their files (e.g., `/tmp`).
  - *Setting:* `chmod +t dir` or `chmod 1777 dir`.

---

## 8. Practical Examples

### Creating a Service User (No Shell, No Home)
Ideal for running applications like Nginx or databases securely.
```bash
sudo useradd -r -s /usr/sbin/nologin myserviceuser
```
- `-r`: Creates a system user (UID < 1000).
- `-s /usr/sbin/nologin`: Prevents the user from logging in interactively.

### Explaining `ls -la` Output
```text
-rw-r--r--  1 john developers 1024 May 20 10:00 notes.txt
```
1. `-rw-r--r--`: Permissions (`-` file type, `rw-` owner, `r--` group, `r--` others).
2. `1`: Number of hard links.
3. `john`: Owner name.
4. `developers`: Group name.
5. `1024`: File size in bytes.
6. `May 20 10:00`: Last modification time.
7. `notes.txt`: Filename.

### Numerical Permissions Table (0-7)
| Value | Binary | Meaning |
| :--- | :--- | :--- |
| 0 | 000 | No permissions (`---`) |
| 1 | 001 | Execute only (`--x`) |
| 2 | 010 | Write only (`-w-`) |
| 3 | 011 | Write and Execute (`-wx`) |
| 4 | 100 | Read only (`r--`) |
| 5 | 101 | Read and Execute (`r-x`) |
| 6 | 110 | Read and Write (`rw-`) |
| 7 | 111 | Read, Write, and Execute (`rwx`) |
