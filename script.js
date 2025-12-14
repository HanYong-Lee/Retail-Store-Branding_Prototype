// ====== 이벤트 팝업 설정 ======

// 팝업 ON/OFF 스위치 (이벤트 없을 땐 false 로만 바꾸면 됨)
const EVENT_POPUP_ENABLED = true;

// 이벤트 기간 설정 (예시: 2025-01-01 ~ 2025-01-15)
// 한국 시간 기준으로 맞춰 주세요.
const EVENT_START = new Date("2025-12-14T00:00:00+09:00");
const EVENT_END   = new Date("2025-12-18T23:59:59+09:00");

// 객관식 정답 설정 (위 HTML에서 value="B" 가 정답이면 "B")
const EVENT_CORRECT_ANSWER = "B";

// 같은 브라우저에서 이미 참여한 사람에게는 다시 안 보여주고 싶으면 true
const EVENT_USE_LOCALSTORAGE = true;
const EVENT_STORAGE_KEY = "kt_yuseong_event_joined_2025_01";


// 탭 전환 기능
const tabButtons = document.querySelectorAll(".tab-btn");
const tabContents = document.querySelectorAll(".tab-content");

tabButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const targetId = btn.dataset.tab;

    // 버튼 active 처리
    tabButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    // 콘텐츠 표시 전환
    tabContents.forEach((section) => {
      if (section.id === targetId) {
        section.classList.add("active");
      } else {
        section.classList.remove("active");
      }
    });

    // 탭 이동 시 스크롤을 상단으로 약간 올려 주기 (모바일 UX)
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
});

// 캐러셀 기능
const productCards = document.querySelectorAll(".product-card");
const prevBtn = document.querySelector(".carousel-arrow.prev");
const nextBtn = document.querySelector(".carousel-arrow.next");
const dots = document.querySelectorAll(".dot");

let currentIndex = 0;

function showProduct(index) {
  // index 범위 보정
  if (index < 0) {
    index = productCards.length - 1;
  } else if (index >= productCards.length) {
    index = 0;
  }
  currentIndex = index;

  productCards.forEach((card, i) => {
    card.classList.toggle("active", i === currentIndex);
  });

  dots.forEach((dot, i) => {
    dot.classList.toggle("active", i === currentIndex);
  });
}

if (prevBtn && nextBtn && productCards.length > 0) {
  prevBtn.addEventListener("click", () => {
    showProduct(currentIndex - 1);
  });

  nextBtn.addEventListener("click", () => {
    showProduct(currentIndex + 1);
  });
}

// 점(인디케이터) 클릭 시 이동
dots.forEach((dot) => {
  dot.addEventListener("click", () => {
    const index = Number(dot.dataset.index);
    showProduct(index);
  });
});

// 초기 상태
showProduct(0);

// ====== 이벤트 팝업 로직 ======

function isWithinEventPeriod() {
  const now = new Date();
  return now >= EVENT_START && now <= EVENT_END;
}

function hasAlreadyJoined() {
  if (!EVENT_USE_LOCALSTORAGE) return false;
  return localStorage.getItem(EVENT_STORAGE_KEY) === "1";
}

function markJoined() {
  if (!EVENT_USE_LOCALSTORAGE) return;
  localStorage.setItem(EVENT_STORAGE_KEY, "1");
}

function showPopup(id) {
  const el = document.getElementById(id);
  if (el) {
    el.classList.remove("hidden");
  }
}

function hidePopup(id) {
  const el = document.getElementById(id);
  if (el) {
    el.classList.add("hidden");
  }
}



// DOM 준비 후 이벤트 팝업 초기화
window.addEventListener("load", function () {
  if (!EVENT_POPUP_ENABLED) return;
  if (!isWithinEventPeriod()) return;
  if (hasAlreadyJoined()) return;

  const eventPopup = document.getElementById("event-popup");
  const correctPopup = document.getElementById("event-correct-popup");
  const submitBtn = document.getElementById("event-submit-btn");
  const closeButtons = document.querySelectorAll("[data-popup-close]");

  if (!eventPopup || !correctPopup || !submitBtn) {
    return;
  }

  // 팝업 열기
  showPopup("event-popup");

  // 닫기 버튼
  closeButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetId = btn.getAttribute("data-popup-close");
      hidePopup(targetId);
    });
  });

  // 정답 제출
  submitBtn.addEventListener("click", () => {
    const checked = document.querySelector('input[name="event-answer"]:checked');

    if (!checked) {
      alert("정답이라고 생각하는 보기를 선택해 주세요!");
      return;
    }

    if (checked.value !== EVENT_CORRECT_ANSWER) {
      alert("아쉽지만 정답이 아닙니다 😢 다시 선택해 주세요!");
      return;
    }

    // 정답 처리
    markJoined();
    hidePopup("event-popup");
    showPopup("event-correct-popup");
  });
});
