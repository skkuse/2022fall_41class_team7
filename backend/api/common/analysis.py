import openai
from openai import Completion
import os
import re
import json
import subprocess
import random
import tempfile
import copydetect
from memory_profiler import memory_usage


def execute_codex(full_filename):
    with open(full_filename, "r") as f:
        example = f.read()

    My_OpenAI_key = "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"
    openai.api_key = My_OpenAI_key

    response = Completion.create(
        model="code-davinci-002",
        prompt=example + "''''\n Here's what the above class is doing \n",
        temperature=0.2,
        max_tokens=64,
        top_p=1.0,
        frequency_penalty=0.0,
        presence_penalty=0.0,
        stop=["''''"],
    )

    answer = response.choices[0].text.strip()
    return answer


def execute_pylint(full_filename: str):
    terminal_command = f"pylint {full_filename}"
    stream = os.popen(terminal_command)
    output = stream.read()

    error = float(re.findall(r"\d+.\d+", output.split("\n")[-3])[0])

    result = int(20 - error)
    if result < 0:
        return [0, output]
    else:
        return [result, output]


def execute_pycodestyle(full_filename: str):
    terminal_command = f"pycodestyle --count {full_filename}"
    stream = os.popen(terminal_command)
    output = stream.read()
    error = len(output.split("\n")) - 1
    result = 20 - error
    if result < 0:
        return [0, output]
    else:
        return [result, output]


def execute_mypy(full_filename: str):
    terminal_command = f"mypy {full_filename}"
    stream = os.popen(terminal_command)
    output = stream.read()
    output_last = output.split("\n")[-2]
    if output_last.split(" ")[0] == "Found":
        error = int(re.findall(r"\d+", output_last)[0])
    else:
        error = 0
    result = 20 - error
    if result < 0:
        return [0, output]
    else:
        return [result, output]


def execute_eradicate(full_filename: str):
    terminal_command = f"eradicate {full_filename}"
    stream = os.popen(terminal_command)
    output = stream.read()
    error = len(output.split("\n")) - 1

    result = 20 - error
    if result < 0:
        return [0, output]
    else:
        return [result, output]


def execute_radon(full_filename: str):
    terminal_command = f"radon {full_filename}"
    stream = os.popen(terminal_command)
    output = stream.read()
    error = len(output.split("\n")) - 1

    result = 20 - error
    if result < 0:
        return [0, output]
    else:
        return [result, output]


def execute_efficiency(full_filename: str, answer_filename: str):
    process1 = subprocess.run(
        ["multimetric", f"{full_filename}"],
        stdout=subprocess.PIPE,
        universal_newlines=True
    )

    output1 = process1.stdout
    output_json1 = json.loads(output1)

    sloc_score1 = output_json1["overall"]["loc"]
    cf_complexity_score1 = output_json1["overall"]["cyclomatic_complexity"]
    r_words_score1 = output_json1["overall"]["halstead_difficulty"]

    program1 = subprocess.Popen(["python", full_filename])
    mem_usage1 = memory_usage(proc=program1, timeout=1)
    df_complexity_score1 = round(max(mem_usage1), 2)

    process2 = subprocess.run(
        ["multimetric", f"{answer_filename}"],
        stdout=subprocess.PIPE,
        universal_newlines=True
    )

    output2 = process2.stdout
    output_json2 = json.loads(output2)
    sloc_score2 = output_json2["overall"]["loc"]
    cf_complexity_score2 = output_json2["overall"]["cyclomatic_complexity"]
    r_words_score2 = output_json2["overall"]["halstead_difficulty"]

    program2 = subprocess.Popen(["python", full_filename])
    mem_usage2 = memory_usage(proc=program2, timeout=1)
    df_complexity_score2 = round(max(mem_usage2), 2)

    loc_score = sloc_score2 - sloc_score1
    if loc_score > 0:
        loc_score_final = 25 - loc_score
        if loc_score_final < 0:
            loc_score_final = 0
    else:
        loc_score_final = 25

    # halstead_difficulty
    diff = r_words_score2 - r_words_score1
    if diff > 0:
        r_words_score_result = 25 - diff
        if r_words_score_result < 0:
            r_words_score_result = 0
    else:
        r_words_score_result = 25

    # dataflow complexity
    diff = df_complexity_score2 - df_complexity_score1
    if diff > 0:
        df_complexity_score_result = 25 - diff
        if df_complexity_score_result < 0:
            df_complexity_score_result = 0
    else:
        df_complexity_score_result = 25
    

    # cyclomatic complexity
    diff = cf_complexity_score2 - cf_complexity_score1
    if diff > 0:
        cf_complexity_score_result = 25 - diff
        if cf_complexity_score_result < 0:
            cf_complexity_score_result = 0
    else:
        cf_complexity_score_result = 25
    

    return {
        "loc": int(loc_score_final),
        "halstead": int(r_words_score_result),
        "data_flow": int(df_complexity_score_result),
        "control_flow": int(cf_complexity_score_result),
    }


def execute_plagiarism(full_filename: str, answer_filename: str):
    fp1 = copydetect.CodeFingerprint(full_filename, 25, 1)
    fp2 = copydetect.CodeFingerprint(answer_filename, 25, 1)
    _, similarities, _ = copydetect.compare_files(fp1, fp2)

    plagiarism = 100 * similarities[0]

    return int(plagiarism)
