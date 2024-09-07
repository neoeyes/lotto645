from bs4 import BeautifulSoup
import urllib.request
import urllib.parse

print('Start...')
url = 'https://dhlottery.co.kr/gameResult.do?method=byWin&wiselog=C_A_1_1'
with urllib.request.urlopen(url) as response:
    html = response.read()
    soup = BeautifulSoup(html, 'html.parser')

    round = soup.find('div', {'class': 'win_result'}).find('strong').text
    desc = soup.find('div', {'class': 'win_result'}).find('p', {'class': 'desc'}).text
    # print(round)
    all_spans = soup.find_all('span', {'class': 'ball_645'})
    # print(all_spans)
    numbers = []
    for span in all_spans:
        numbers.append(int(span.text))
text = f'/* {round} {desc} */ {numbers}'
print(text)


def insert_string_in_file(file_path, position, string_to_insert, encoding='utf-8'):
    try:
        # 파일 읽기
        with open(file_path, 'r', encoding=encoding) as file:
            content = file.read()

        # 문자열 삽입
        new_content = content[:position] + string_to_insert + content[position:]

        # 파일 쓰기
        with open(file_path, 'w', encoding=encoding) as file:
            file.write(new_content)

        print("문자열이 성공적으로 삽입되었습니다.")
    except Exception as e:
        print(f"오류 발생: {e}")

# 사용 예시
file_path = './src/store/modules/winNumbers.js'  # 파일 경로를 입력하세요
position = 44              # 삽입할 위치 (문자열의 인덱스)
string_to_insert = f'{text},\n'  # 삽입할 문자열

insert_string_in_file(file_path, position, string_to_insert)

print('End.')
