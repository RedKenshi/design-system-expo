import os

def rename_files(folder_path, prefix):
    # Get list of files in the folder
    files = os.listdir(folder_path)
    # Iterate over each file
    for index, file_name in enumerate(files):
        # Construct new file name
        new_file_name = f"{prefix}_{index + 1}{os.path.splitext(file_name)[1]}"
        # Rename the file
        os.rename(os.path.join(folder_path, file_name), os.path.join(folder_path, new_file_name))

# Main function
def main():
    folder_path = "./media"
    prefix = "media"
    
    rename_files(folder_path, prefix)
    print("Files renamed successfully.")

if __name__ == "__main__":
    main()