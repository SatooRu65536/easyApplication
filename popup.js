window.onload = init;

async function init() {
  const storageData = await chrome.storage.local.get();
  Object.keys(storageData).forEach((key) => {
    const ele = document.getElementById(key);

    if (ele) {
      ele.value = storageData[key];
    } else {
      const radio = document.getElementById(`sex_typ_${storageData[key]}`);
      if (radio) radio.checked = true;
    }
  });

  let sex_typ_value = 2;
  const st1_is_checked = document.getElementsByName("sex_typ")[1].checked;
  if (st1_is_checked) sex_typ_value = 1;

  const data = {
    cstmr_lnm: document.getElementById("cstmr_lnm").value,
    cstmr_fnm: document.getElementById("cstmr_fnm").value,
    cstmr_lkn: document.getElementById("cstmr_lkn").value,
    cstmr_fkn: document.getElementById("cstmr_fkn").value,
    sex_typ: sex_typ_value,
    birth_yyyy: document.getElementById("birth_yyyy").value,
    birth_mm: document.getElementById("birth_mm").value,
    birth_dd: document.getElementById("birth_dd").value,
    telno1: document.getElementById("telno1").value,
    telno2: document.getElementById("telno2").value,
    telno3: document.getElementById("telno3").value,
    ml_addr: document.getElementById("ml_addr").value,
    ml_addr_cnfm: document.getElementById("ml_addr").value,
    cmnt01: document.getElementById("cmnt01").value,
    cmnt02: document.getElementById("cmnt02").value,
    cmnt11: document.getElementById("cmnt11").value,
    cmnt12: document.getElementById("cmnt12").value,
    cmnt13: document.getElementById("cmnt13").value,
    cmnt14: document.getElementById("cmnt14").value,
    gnrl_cstmr_passwd: document.getElementById("gnrl_cstmr_passwd").value,

    lastNm: document.getElementById("lastNm").value,
    firstNm: document.getElementById("firstNm").value,
    lastNmKn: document.getElementById("lastNmKn").value,
    firstNmKn: document.getElementById("firstNmKn").value,
    telNo: document.getElementById("telNo").value,
  };

  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: setData,
    args: [data],
  });
}

function setData(data) {
  console.log(data);
  Object.keys(data).forEach((key) => {
    const ele = document.getElementsByName(key)[0];
    if (ele) {
      if (key !== "sex_typ") {
        ele.value = data[key];
      } else {
        const i = data[key] === 2 ? 0 : 1;
        const radio = document.getElementsByName(key)[i];
        radio.checked = true;
      }
    }
  });
}

const input = [...document.getElementsByTagName("input")];
input.forEach((e) => {
  e.addEventListener("change", (e) => {
    if (e.target.type === "radio") {
      chrome.storage.local.set({ [e.target.name]: e.target.value });
    } else {
      chrome.storage.local.set({ [e.target.id]: e.target.value });
    }
    init();
  });
});
