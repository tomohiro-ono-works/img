import { attachSaveHandler } from "./modal-save-handler.js";

// モーダルの生成と表示処理
export function showSettingsModal(targetNode) {
  const existingModal = document.querySelector(".settings-modal");
  if (existingModal) existingModal.remove();

  const modal = document.createElement("div");
  modal.className = "settings-modal";

  modal.innerHTML = `
    <h2 style="margin-bottom: 20px;">設定画面</h2>
    <label style="display:block; margin-bottom:8px; font-weight: bold;">処理タイプ</label>
    <select id="operation-type" style="margin-bottom:20px; padding: 10px; border-radius: 6px; background-color: #f4f4f4; border: 1px solid #ccc; width: 100%;">
      <option value="" disabled selected>選択してください</option>
      <option value="file-import">ファイル取得</option>
      <option value="excel-macro">Excelマクロ実行</option>
      <option value="sql-transform">SQLでデータ加工</option>
      <option value="bq-create">BigQueryテーブル作成</option>
    </select>

    <div id="operation-fields"></div>

    <br>
    <button id="save-modal" style="margin-top:20px; padding: 10px 20px; border: none; background-color: #2563eb; color: white; border-radius: 6px; cursor: pointer; font-weight: bold;">保存</button>
  `;

  document.body.appendChild(modal);

  // ノードIDがなければ付与
  if (!targetNode.dataset.nodeId) {
    targetNode.dataset.nodeId = `node-${crypto.randomUUID()}`;
  }

  // 🔽 保存済みデータを復元
  const saved = targetNode.dataset.settings;
  if (saved) {
    try {
      const settings = JSON.parse(saved);
      const typeSelect = modal.querySelector("#operation-type");
      typeSelect.value = settings.operationType;
      renderFields(settings.operationType);

      setTimeout(() => {
        const fieldsContainer = modal.querySelector("#operation-fields");
        fieldsContainer.querySelectorAll("input, select").forEach(input => {
          const label = input.previousElementSibling?.textContent?.trim();
          if (settings[label]) {
            if (input.type !== "file") {
              input.value = settings[label];
            }
          }
        });
      }, 50);
    } catch (e) {
      console.warn("復元エラー:", e);
    }
  }

  document.getElementById("operation-type").addEventListener("change", (e) => {
    renderFields(e.target.value);
  });

  function renderFields(type) {
    const container = document.getElementById("operation-fields");
    container.innerHTML = "";

    const inputStyle = "padding: 10px; border-radius: 6px; background-color: #f9f9f9; border: 1px solid #ccc; width: 100%; margin-bottom: 15px;";
    const labelStyle = "display:block; margin-bottom: 6px; font-weight: bold;";

    if (type === "file-import") {
      container.innerHTML = `
        <label style="${labelStyle}">ファイル選択</label>
        <input id="custom-file-path" type="text" readonly placeholder="クリックしてファイルを選択" style="${inputStyle}; cursor: pointer;">
        <label style="${labelStyle}">ファイル形式</label><select style="${inputStyle}"><option>csv</option><option>Excel</option></select>
        <div style="display: flex; gap: 20px;">
          <div style="padding-right: 20px; flex: 1;">
            <label style="${labelStyle}">ヘッダー開始行</label>
            <input type="number" value="1" style="${inputStyle}">
          </div>
          <div style="flex: 1;">
            <label style="${labelStyle}">データ開始行</label>
            <input type="number" value="2" style="${inputStyle}">
          </div>
        </div>
        <div style="display: flex; gap: 20px;">
          <div style="padding-right: 20px; flex: 1;">
            <label style="${labelStyle}">文字コード</label>
            <select style="${inputStyle}"><option>UTF-8</option><option>Shift-JIS</option></select>
          </div>
          <div style="flex: 1;">
            <label style="${labelStyle}">デリミタ</label>
            <input type="text" value="," placeholder="," style="${inputStyle}">
          </div>
        </div>        
        <label style="${labelStyle}">シート名</label><input type="text" style="${inputStyle}">
      `;

      const filePathInput = document.getElementById("custom-file-path");
      filePathInput.addEventListener("click", async () => {
        const input = document.createElement("input");
        input.type = "file";
        input.style.display = "none";
        input.onchange = (e) => {
          const file = e.target.files[0];
          if (file) filePathInput.value = file.name;
        };
        document.body.appendChild(input);
        input.click();
        document.body.removeChild(input);
      });
    } else if (type === "sql-transform") {
      container.innerHTML = `
        <label style="${labelStyle}">ファイル選択</label>
        <input id="custom-file-path" type="text" readonly placeholder="クリックしてファイルを選択" style="${inputStyle}; cursor: pointer;">
      `;

      const filePathInput = document.getElementById("custom-file-path");
      filePathInput.addEventListener("click", async () => {
        const input = document.createElement("input");
        input.type = "file";
        input.style.display = "none";
        input.onchange = (e) => {
          const file = e.target.files[0];
          if (file) filePathInput.value = file.name;
        };
        document.body.appendChild(input);
        input.click();
        document.body.removeChild(input);
      });
    } else if (type === "bq-create") {
      container.innerHTML = `
        <label style="${labelStyle}">データ選択</label><input type="text" value="aaaaa/bbbbb" style="${inputStyle}">
        <label style="${labelStyle}">BigQueryテーブル名</label><input type="text" style="${inputStyle}">
      `;
    }
  }

  attachSaveHandler(modal, targetNode);

}
