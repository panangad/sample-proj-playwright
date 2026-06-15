import pytest
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager


URL = "https://lokaai.in/code?id=add-two-numbers"
EXPECTED_TEXT = "Linked Digit Addition"


@pytest.fixture(scope="module")
def driver():
    options = Options()
    options.add_argument("--headless")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    options.add_argument("--disable-gpu")

    service = Service(ChromeDriverManager().install())
    drv = webdriver.Chrome(service=service, options=options)
    drv.implicitly_wait(10)
    yield drv
    drv.quit()


def test_page_contains_linked_digit_addition(driver):
    driver.get(URL)
    wait = WebDriverWait(driver, 15)
    wait.until(EC.presence_of_element_located((By.TAG_NAME, "body")))

    page_text = driver.find_element(By.TAG_NAME, "body").text
    assert EXPECTED_TEXT in page_text, (
        f"Expected text '{EXPECTED_TEXT}' not found on page.\n"
        f"Page text (first 500 chars):\n{page_text[:500]}"
    )
