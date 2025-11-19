#!/usr/bin/env python3
"""
Parse instruction.txt files using Gemini VLM model via OpenAI API.
Extracts target_object, self_attribute, and spatial_condition.
"""

import os
import json
from pathlib import Path
from openai import OpenAI

# Initialize OpenAI client for Gemini
# You need to set your API key and base URL
client = OpenAI(
    api_key=os.environ.get("GEMINI_API_KEY"),  # or your actual API key
    base_url="https://generativelanguage.googleapis.com/v1beta/openai/"
)

def parse_instruction_with_gemini(instruction_text):
    """
    Use Gemini model to parse instruction into components.
    
    Args:
        instruction_text: The instruction string to parse
        
    Returns:
        dict with keys: target_object, self_attribute, spatial_condition
    """
    
    prompt = f"""Please analyze the following navigation instruction and extract three components:

1. **target_object**: The object that needs to be found (just the object name, e.g., "cabinet", "sofa")
2. **self_attribute**: Any attributes or descriptions of the target object itself (e.g., "red", "large", "wooden"). If none, return empty string.
3. **spatial_condition**: Any spatial relationships or location descriptions (e.g., "near the door", "in the corner", "next to the window"). If none, return empty string.

Instruction: "{instruction_text}"

Please respond ONLY with a valid JSON object in this exact format:
{{
    "target_object": "...",
    "self_attribute": "...",
    "spatial_condition": "..."
}}

Do not include any other text or explanation."""

    try:
        response = client.chat.completions.create(
            model="gemini-2.5-flash",  # or gemini-1.5-pro
            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            temperature=0.1,  # Low temperature for consistent parsing
        )
        
        # Extract the response text
        response_text = response.choices[0].message.content.strip()
        
        # Try to parse JSON from the response
        # Sometimes the model might wrap it in markdown code blocks
        if "```json" in response_text:
            response_text = response_text.split("```json")[1].split("```")[0].strip()
        elif "```" in response_text:
            response_text = response_text.split("```")[1].split("```")[0].strip()
        
        result = json.loads(response_text)
        
        # Validate that all required keys exist
        required_keys = ["target_object", "self_attribute", "spatial_condition"]
        for key in required_keys:
            if key not in result:
                result[key] = ""
        
        return result
        
    except Exception as e:
        print(f"Error parsing instruction '{instruction_text}': {e}")
        return {
            "target_object": "",
            "self_attribute": "",
            "spatial_condition": ""
        }


def process_bagfile_folder(bagfile_path):
    """
    Process a single bagfile folder: read instruction.txt and create parsed files.
    
    Args:
        bagfile_path: Path to the bagfile folder
    """
    instruction_file = bagfile_path / "instruction.txt"
    
    if not instruction_file.exists():
        print(f"⚠️  No instruction.txt found in {bagfile_path.name}")
        return
    
    # Read instruction
    with open(instruction_file, 'r', encoding='utf-8') as f:
        instruction_text = f.read().strip().replace('%', '')
    
    print(f"Processing: {bagfile_path.name}")
    print(f"  Instruction: {instruction_text}")
    
    # Parse with Gemini
    result = parse_instruction_with_gemini(instruction_text)
    
    print(f"  → target_object: {result['target_object']}")
    print(f"  → self_attribute: {result['self_attribute']}")
    print(f"  → spatial_condition: {result['spatial_condition']}")
    
    # Write results to files (overwrite if exists)
    files_to_write = {
        "target_object.txt": result["target_object"],
        "self_attribute.txt": result["self_attribute"],
        "spatial_condition.txt": result["spatial_condition"]
    }
    
    for filename, content in files_to_write.items():
        output_file = bagfile_path / filename
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(content)
    
    print(f"✓ Completed {bagfile_path.name}\n")


def main():
    """Main function to process all bagfile folders."""
    
    # Check if API key is set
    if not os.environ.get("GEMINI_API_KEY"):
        print("ERROR: GEMINI_API_KEY environment variable not set!")
        print("Please set it with: export GEMINI_API_KEY='your-api-key'")
        return
    
    # Define the base path
    instructions_base = Path("./static/instructions/go2/spatial")
    
    if not instructions_base.exists():
        print(f"ERROR: Directory {instructions_base} does not exist!")
        return
    
    # Get all bagfile folders
    bagfile_folders = sorted([d for d in instructions_base.iterdir() 
                             if d.is_dir() and d.name.startswith("bagfile_")])
    
    if not bagfile_folders:
        print(f"No bagfile folders found in {instructions_base}")
        return
    
    print(f"Found {len(bagfile_folders)} bagfile folders to process\n")
    print("=" * 60)
    
    # Process each folder
    for i, bagfile_path in enumerate(bagfile_folders, 1):
        print(f"[{i}/{len(bagfile_folders)}] ", end="")
        process_bagfile_folder(bagfile_path)
    
    print("=" * 60)
    print(f"✓ All done! Processed {len(bagfile_folders)} folders.")


if __name__ == "__main__":
    main()
