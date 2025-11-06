# 🔐 Firestore 安全規則設定

## ⚠️ 如果出現「操作失敗，請稍後再試」錯誤

這通常是 **Firestore 安全規則** 的問題！

---

## 📋 設定步驟

### 1️⃣ 前往 Firebase Console

```
https://console.firebase.google.com/project/run2025-7734c/firestore/rules
```

### 2️⃣ 複製以下規則

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    
    // 用戶資料規則
    match /users/{userId} {
      // 任何人都可以讀取用戶資料
      allow read: if true;
      // 只有本人可以寫入自己的資料
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // 活動資料規則
    match /activities/{activityId} {
      // 任何人都可以讀取活動
      allow read: if true;
      
      // 已登入的用戶可以創建活動
      allow create: if request.auth != null 
                    && request.resource.data.creatorId == request.auth.uid;
      
      // 只有活動創建者可以刪除活動
      allow delete: if request.auth != null 
                    && resource.data.creatorId == request.auth.uid;
      
      // 活動創建者可以完全更新，其他已登入用戶只能更新 participants 欄位
      allow update: if request.auth != null && (
        // 創建者可以更新所有欄位
        resource.data.creatorId == request.auth.uid
        ||
        // 其他用戶只能更新 participants 欄位（加入/取消活動）
        (
          request.resource.data.diff(resource.data).affectedKeys().hasOnly(['participants'])
          && request.resource.data.creatorId == resource.data.creatorId
          && request.resource.data.date == resource.data.date
          && request.resource.data.pace == resource.data.pace
          && request.resource.data.distance == resource.data.distance
        )
      );
    }
  }
}
```

### 3️⃣ 點擊「發布」按鈕

---

## 🧪 測試規則（開發用）

如果你想要更寬鬆的規則（**僅供開發測試，不建議正式環境使用**）：

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    // ⚠️ 警告：允許任何已登入用戶讀寫所有資料
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

---

## 🔍 規則說明

### 用戶資料 (`/users/{userId}`)
- ✅ **讀取**：所有人（顯示暱稱用）
- ✅ **寫入**：僅限本人

### 活動資料 (`/activities/{activityId}`)
- ✅ **讀取**：所有人（瀏覽活動列表）
- ✅ **創建**：已登入用戶
- ✅ **刪除**：僅限活動創建者
- ✅ **更新**：
  - 創建者：可更新所有欄位
  - 其他用戶：僅能更新 `participants`（加入/取消活動）

---

## 💡 常見錯誤

### ❌ 錯誤：permission-denied

**原因：** Firestore 規則阻止了操作

**解決方法：**
1. 檢查規則是否正確設定
2. 確認已登入
3. 確認 `request.auth.uid` 有值

### ❌ 錯誤：Missing or insufficient permissions

**原因：** 規則太嚴格

**解決方法：**
- 使用上面的「測試規則」進行開發
- 正式環境使用「正式規則」

---

## 🚀 檢查清單

- [ ] 已前往 Firebase Console
- [ ] 已複製規則
- [ ] 已點擊「發布」
- [ ] 已重新整理網頁測試
- [ ] 可以成功加入活動 ✅

---

## 📞 還是不行？

1. **清除瀏覽器快取**
2. **重新登入**
3. **檢查 Console 錯誤訊息**（F12 開發者工具）
4. **確認 Firebase 專案 ID 正確**

---

最後更新：2025/11/05


