# Feedback for Lesson 05: Linux File System

## Overview
The article is well-structured and covers the essential topics for a beginner DevOps engineer. The use of real-world "DevOps nuances" (like the `lsof` tip for deleted files) is very helpful. However, there are a few technical gaps where a beginner might get stuck.

## Confusing Parts & Missing Explanations

### 1. Missing Formatting Step (`mkfs`)
In the **Mounting** section, the article says: *"Suppose you added a new disk... created a partition `/dev/sdb1` and formatted it in `ext4`."*
- **Issue:** The article explains how to use `fdisk` to create a partition, but it **never shows the command to format it** (e.g., `sudo mkfs.ext4 /dev/sdb1`). A beginner following this literally would fail at the `mount` step because the "device has no file system."

### 2. How to find the UUID?
The `/etc/fstab` section strongly recommends using `UUID` instead of device names.
- **Issue:** It doesn't explain **how to find the UUID** of a partition. Adding the `blkid` or `lsblk -f` command would make this step actionable.

### 3. `fdisk` Interaction
The article lists `fdisk` flags (`n`, `p`, `w`), but `fdisk` is an interactive tool that asks several questions (partition number, first sector, last sector).
- **Issue:** A beginner might be intimidated by the prompts. A brief mention that "pressing Enter for default values is usually fine" would lower the barrier.

### 4. Advanced Shell Syntax in Script
The practical backup script uses `$?` and `>&2`.
- **Issue:** For a "Level 1" learner, these might be confusing. 
    - Quick explanation that `$?` is the "success code" of the last command.
    - Explanation that `>&2` redirects errors to the error stream.

### 5. `lsof` Command
The tip about `lsof | grep deleted` is excellent for troubleshooting.
- **Issue:** Since this is a beginner guide, it should mention that `lsof` might not be installed by default on all minimal distributions (e.g., some Docker images or minimal CentOS) and may require `sudo`.

## Suggestions for Improvement
- **Visualization:** A small diagram or text-based tree showing the difference between `/src/directory/` (contents) and `/src/directory` (the folder itself) in `rsync` would be very effective.
- **Safety Warning:** Add a clearer warning that `rm` is permanent in Linux, especially when discussing `find ... -delete` in the script.

## Conclusion
The content is high-quality and the "Why this matters for DevOps" sections are the strongest part. Closing the gap between "creating a partition" and "mounting" it (by adding `mkfs`) is the most critical fix needed.
