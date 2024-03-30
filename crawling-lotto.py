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
print(f'/* {round} {desc} */ {numbers}')
print('End.')
