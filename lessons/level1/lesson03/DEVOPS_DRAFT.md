# DEVOPS_DRAFT.md - Lesson 03: Bash CLI Basics (Expert Technical Base)

## 1. Anatomy of a Bash Command
A command typically consists of three parts:
- **Command:** The executable program (e.g., `ls`).
- **Options (Flags):** Modify how the command behaves (e.g., `-l`, `-a`, `--help`).
- **Arguments:** The data the command acts upon (e.g., a file path `/etc`).

Example: `ls -la /var/log`

## 2. Navigation & File System Inspection
- `pwd` (Print Working Directory): Shows absolute path to current directory.
- `ls` (List):
    - `ls -l`: Long format (permissions, owner, size, date).
    - `ls -a`: Show hidden files (starting with `.`).
    - `ls -h`: Human-readable sizes (KB, MB, GB).
- `cd` (Change Directory):
    - `cd ~`: Go to home directory.
    - `cd ..`: Go one level up.
    - `cd -`: Go to the previous directory.
- `tree`: Visualizes directory structure (often needs `sudo apt install tree`).

## 3. File & Directory Management
- `mkdir -p project/src`: Create nested directories.
- `touch app.log`: Create empty file or update timestamp.
- `cp -r dir1 dir2`: Copy directory recursively.
- `mv file.txt renamed.txt`: Move or rename.
- `rm -rf sensitive_dir`: Remove files/folders (Warning: DANGEROUS).
- `rmdir`: Remove empty directory.

## 4. Viewing File Content
- `cat`: Print entire file to stdout.
- `less`: Interactive viewer (scroll up/down, search with `/`).
- `head -n 5`: First 5 lines.
- `tail -f /var/log/syslog`: Last lines, wait for new output (crucial for logs).

## 5. Searching (Find & Grep)
- `find /var/log -name "*.log"`: Find files by name pattern.
- `grep "ERROR" /var/log/syslog`: Search for text inside files.
- `grep -i`: Case-insensitive.
- `grep -r`: Recursive search in directories.

## 6. Text Processing, Redirects, & Pipes
- `echo "Hello World" > output.txt`: Overwrite file.
- `echo "Line 2" >> output.txt`: Append to file.
- `cat file.txt | grep "search" | wc -l`: Pipe output to another command (Count matching lines).
- `|` (Pipe): Takes stdout of one command and gives it as stdin to the next.

## 7. Process Management
- `ps aux`: List all running processes.
- `top`: Real-time system monitoring (CPU, RAM).
- `htop`: Better version of `top` (interactive).
- `kill -9 <PID>`: Forcefully terminate a process.

## 8. Getting Help
- `man <command>`: Comprehensive manual.
- `<command> --help`: Brief help overview.
- `apropos <keyword>`: Search man pages for specific functionality.

## 9. Top-20 Commands Cheat Sheet (Data for Table)
1. `ls` - List files
2. `cd` - Change directory
3. `pwd` - Current path
4. `mkdir` - Make directory
5. `rm` - Remove
6. `cp` - Copy
7. `mv` - Move/Rename
8. `touch` - Create empty file
9. `cat` - Show file
10. `grep` - Search text
11. `find` - Search files
12. `chmod` - Change permissions
13. `chown` - Change owner
14. `sudo` - Execute as root
15. `top` / `htop` - Task manager
16. `ps` - Processes
17. `kill` - Kill process
18. `df -h` - Disk space
19. `du -sh` - Directory size
20. `history` - Command history
