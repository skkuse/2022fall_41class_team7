import openai
from openai import Completion
import os
import re
import json
import subprocess
import random
import tempfile
import re
from copydetect import CopyDetector
from memory_profiler import memory_usage

def execute_codex(full_filename):
    with open(full_filename, "r") as f:
        example = f.read()
    
    My_OpenAI_key = "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"
    openai.api_key = My_OpenAI_key
    
    response = Completion.create(
        model="code-davinci-002",
        prompt= example + "\"\"\"\nHere's what the above class is doing:\n1.",
        temperature=0.2,
        max_tokens=64,
        top_p=1.0,
        frequency_penalty=0.0,
        presence_penalty=0.0,
        stop=["\"\"\""]
    )

    answer = response.choices[0].text.strip()
    return answer

def execute_pylint(full_filename: str):
    terminal_command = f'pylint {full_filename}'
    stream = os.popen(terminal_command)
    output = stream.read()

    error = float(re.findall(r'\d+.\d+', output.split('\n')[-3])[0])
        
    result = int(20 - error)
    if result < 0:
        return [0, output]
    else:
        return [result, output]


def execute_pycodestyle(full_filename: str):
    terminal_command = f'pycodestyle --count {full_filename}'
    stream = os.popen(terminal_command)
    output = stream.read()
    error = len(output.split("\n")) - 1
    result = 20 - error
    if result < 0:
        return [0, output]
    else:
        return [result, output]


def execute_mypy(full_filename: str):
    terminal_command = f'mypy {full_filename}'
    stream = os.popen(terminal_command)
    output = stream.read()
    output_last = output.split('\n')[-2]
    if output_last.split(' ')[0] == "Found":
        error = int(re.findall(r'\d+', output_last)[0])
    else:
        error = 0
    result = 20 - error
    if result < 0:
        return [0, output]
    else:
        return [result, output]
    
    
def execute_eradicate(full_filename: str):
    terminal_command = f'eradicate {full_filename}'
    stream = os.popen(terminal_command)
    output = stream.read()
    error = len(output.split('\n')) - 1
    
    result = 20 - error
    if result < 0:
        return [0, output]
    else:
        return [result, output]
    
def execute_radon(full_filename: str):
    terminal_command = f'radon {full_filename}'
    stream = os.popen(terminal_command)
    output = stream.read()
    error = len(output.split('\n')) - 1
    
    result = 20 - error
    if result < 0:
        return [0, output]
    else:
        return [result, output]


def execute_efficiency(full_filename: str):
    # process = subprocess.run(
    #     ['multimetric', f'{full_filename}'],
    #     stdout=subprocess.PIPE,
    #     universal_newlines=True
    # )

    # output = process.stdout
    # output_json = json.loads(output)

    # sloc_score = output_json['overall']['loc']
    # cf_complexity_score = output_json['overall']['cyclomatic_complexity']
    # r_words_score = output_json['overall']['halstead_difficulty']
    
    # program = subprocess.Popen(["python", full_filename])
    # mem_usage = memory_usage(proc=program, timeout=1)
    # df_complexity_score = round(max(mem_usage), 2)

    return {
        "loc": random.randrange(15, 25),
        "halstead": random.randrange(15, 25),
        "data_flow": random.randrange(15, 25),
        "control_flow": random.randrange(15, 25)
    }


def execute_plagiarism(full_filename: str):
    # DISPLAY_THRESHOLD = 0.5
    # ANTO_OPEN_FLAG = False
    # SILENT_FLAG = True
    # NUM_FILES_COMPARED_FIELD = 'num_files_compared'
    # SIMILARITY_FIELD = 'similarity_score'

    # temp_report = tempfile.NamedTemporaryFile()

    # Initialize CopyDetector
    # detector = CopyDetector(
    #     test_dirs=test_dirs,
    #     ref_dirs=ref_dirs,
    #     out_file=temp_report.name,
    #     display_t=DISPLAY_THRESHOLD,
    #     autoopen=ANTO_OPEN_FLAG,
    #     silent=SILENT_FLAG,
    # )
    # detector.add_file(full_filename)
    # detector.run()
    # detector.generate_html_report()

    # # BeautifulSoup HTML Parsing
    # with open(f'{temp_report.name}.html', 'r') as fp:
    #     soup = BeautifulSoup(fp, "html.parser")
    # soup.get_text()

    # # Get the number of files compared (int)
    # num_of_files_string = soup.find("p").find_next("p").contents[2].strip()
    # num_files = int(''.join(filter(str.isdigit, num_of_files_string)))

    # # Get the similarity score (float)
    # similarity_string = soup.find("p").find_next("p").contents[4].strip()
    # sim_score = [float(s) for s in re.findall(r'\d+\.\d+', similarity_string)]

    return random.randrange(30, 45)
