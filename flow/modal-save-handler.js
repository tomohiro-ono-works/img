export function attachSaveHandler(modal, targetNode) {
  const saveBtn = modal.querySelector("#save-modal");
  if (!saveBtn) return;

  saveBtn.addEventListener("click", () => {
    const selectedType = document.getElementById("operation-type").value;
    const typeMap = {
      "file-import": { label: "ファイル取得", icon: "ms-excel.png" },
      "excel-macro": { label: "Excelマクロ実行", icon: "vba.png" },
      "sql-transform": { label: "SQLでデータ加工", icon: "sql.jpg" },
      "bq-create": { label: "BigQueryテーブル作成", icon: "bq.png" }
    };
    const typeInfo = typeMap[selectedType];

    if (typeInfo) {
      const blockContent = targetNode.querySelector(".block-content");
      if (blockContent) {
        blockContent.innerHTML = typeInfo.icon
          ? `<img src="${typeInfo.icon}" alt="icon" style="height: 40px; vertical-align: middle; margin-right: 6px;">${typeInfo.label}`
          : typeInfo.label;
      }
    }

    const operationType = modal.querySelector("#operation-type").value;
    const fieldsContainer = modal.querySelector("#operation-fields");
    const formData = { operationType };

    fieldsContainer.querySelectorAll("input, select").forEach(input => {
      const label = input.previousElementSibling?.textContent?.trim() || "unknown";
      formData[label] = input.type === "file"
        ? (input.files[0]?.name || "")
        : input.value;
    });

    // ノードに保存
    targetNode.dataset.settings = JSON.stringify(formData);

    // 🔽 追加：localStorage に保存
    const nodeId = targetNode.dataset.nodeId || targetNode.id || `node-${Date.now()}`;
    formData.nodeId = nodeId;
    localStorage.setItem(nodeId, JSON.stringify(formData));

    console.log("✅ 保存データ（localStorage付き）:", formData);

    modal.remove();
  });
}
