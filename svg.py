import os

def gather_svg_data(folder_path, output_file):
    with open(output_file, "w") as out:
        for root, _, files in os.walk(folder_path):
            for file_name in files:
                if file_name.endswith(".svg"):
                    folder_name = os.path.basename(root)
                    file_name_cleaned = file_name.replace("-", "_")  # Replace dashes with underscores
                    prefix = f"[{folder_name}]_{file_name_cleaned}"
                    file_path = os.path.join(root, file_name)
                    out.write(f"{prefix}\n")  # Writing subfolder and filename as prefix
                    with open(file_path, "r") as file:
                        out.write(file.read() + "\n\n")  # Writing SVG content with a newline after each
    print("SVG data from multiple files has been gathered into", output_file)

# Main function
def main():
    parent_folder_path = "../../Downloads"
    output_file = "output.svg"
    
    gather_svg_data(parent_folder_path, output_file)

if __name__ == "__main__":
    main()