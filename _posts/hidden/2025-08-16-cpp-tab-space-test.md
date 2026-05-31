---
layout:     post
title:      "C/C++ Tab Space 對齊測試"
subtitle:   "測試代碼註解中 tab 和 space 混用的對齊問題"
date:       2025-08-16
author:     "Claude"
header-img: "https://img.allenspace.de/20250830050705_evvnbpcj0l.32idicxze0.webp"
catalog: true
tags:
    - 測試
    - C++
    - 代碼對齊
---

> 這篇測試文章由 Claude 生成，用於驗證新功能的運作是否正常，以及頁面樣式是否正確顯示。我選擇保留這些內容，作為未來回顧的足跡

## Tab 和 Space 混用對齊問題測試

這篇文章專門測試 C/C++ 代碼中 tab 和 space 混用造成的註解對齊問題。

### 測試案例 1：純 Tab 對齊（正常情況）

```cpp
#include <iostream>
#include <vector>

int main() {
	int a = 10;		// 這是註解 1
	int b = 20;		// 這是註解 2  
	int c = 30;		// 這是註解 3
	int longer_var = 40;	// 這是註解 4
	
	std::cout << a + b + c << std::endl;
	return 0;
}
```

### 測試案例 2：純 Space 對齊（正常情況）

```cpp
#include <iostream>
#include <vector>

int main() {
    int a = 10;              // 這是註解 1
    int b = 20;              // 這是註解 2  
    int c = 30;              // 這是註解 3
    int longer_var = 40;     // 這是註解 4
    
    std::cout << a + b + c << std::endl;
    return 0;
}
```

### 測試案例 3：Tab Space 混用（問題情況）

```cpp
#include <iostream>
#include <vector>

int main() {
    int a = 10;	        // 這是註解 1 (space + tab)
	int b = 20;         // 這是註解 2 (tab + space)
    int c = 30;		    // 這是註解 3 (space + tab)
	int longer_var = 40;    // 這是註解 4 (tab + space)
    
    std::cout << a + b + c << std::endl;
    return 0;
}
```

### 測試案例 4：複雜的結構體對齊

```cpp
struct Point {
    double x;           // X 座標
    double y;           // Y 座標  
    double z;           // Z 座標
    std::string name;   // 點的名稱
};

struct ComplexStructure {
	int		id;			// 唯一識別碼
	char	buffer[256];	// 緩衝區
	float	values[10];		// 數值陣列
	bool	is_active;		// 是否啟用
};
```

### 測試案例 5：函數參數註解對齊

```cpp
void processData(
    int input_size,     // 輸入資料大小
    char* buffer,       // 資料緩衝區
    bool validate,      // 是否驗證
    double threshold    // 閾值設定
) {
    // 函數實現
}

void anotherFunction(
	std::vector<int>& data,	// 資料向量
	const std::string& name,	// 名稱字串
	bool debug_mode,		// 除錯模式
	float precision		// 精度設定
) {
    // 函數實現
}
```

### 測試案例 6：宏定義對齊

```cpp
#define MAX_SIZE        1024    // 最大尺寸
#define DEFAULT_TIMEOUT 30      // 預設超時時間
#define BUFFER_LENGTH   512     // 緩衝區長度
#define ERROR_CODE      -1      // 錯誤代碼

#define LONG_MACRO_NAME		100	// 長宏名稱
#define SHORT			200	// 短名稱
#define MEDIUM_LENGTH		300	// 中等長度
```

### 測試案例 7：類成員註解對齊

```cpp
class DataProcessor {
private:
    int count_;                 // 計數器
    std::string filename_;      // 檔案名稱
    bool is_initialized_;       // 初始化狀態
    std::vector<double> data_;  // 資料容器

public:
	void process();		// 處理資料
	bool validate();	// 驗證資料
	void reset();		// 重設狀態
	int getCount() const;	// 獲取計數
};
```

### 測試案例 8：條件編譯對齊

```cpp
#ifdef DEBUG
    #define LOG(msg)    std::cout << msg << std::endl  // 除錯輸出
    #define ASSERT(x)   assert(x)                      // 斷言檢查
#else
    #define LOG(msg)    // 無操作            
    #define ASSERT(x)   // 無操作
#endif

#if defined(WINDOWS)
	#define PATH_SEP	"\\"	// Windows 路徑分隔符
#elif defined(UNIX)
	#define PATH_SEP	"/"	// Unix 路徑分隔符
#else
	#define PATH_SEP	"/"	// 預設路徑分隔符
#endif
```

### 測試案例 9：複雜表達式對齊

```cpp
int calculateResult() {
    int result = (a * b) +          // 乘法運算
                 (c / d) -          // 除法運算
                 (e % f) +          // 模數運算
                 (g << h);          // 位元左移
                 
    return result;
}

void complexAssignment() {
	variable1 = value1;		// 賦值 1
	much_longer_variable2 = value2;	// 賦值 2
	var3 = very_long_value_name;	// 賦值 3
	x = y;				// 賦值 4
}
```

### 測試案例 10：內聯註解對齊

```cpp
int process_data(
    int size,       /* 資料大小 */
    char* data,     /* 資料指標 */
    bool flag       /* 控制旗標 */
) {
    for (int i = 0; i < size; ++i) {    /* 迴圈處理 */
        data[i] = transform(data[i]);   /* 資料轉換 */
    }                                   /* 迴圈結束 */
    
    return size;    /* 回傳處理數量 */
}
```

---

## 修復前後對比

### 修復前的問題

在沒有統一 tab 寬度設定時，不同瀏覽器可能顯示不同的對齊效果：

```cpp
// 可能的顯示效果（tab 寬度不一致）
int a = 10;	// 註解可能對不齊
int longer_var = 20;	// 這個註解位置可能偏移
```

### 修復後的效果

設定 `tab-size: 4` 後，所有 tab 都會以統一的 4 個字符寬度顯示：

```cpp
// 修復後的顯示效果（tab 寬度一致）
int a = 10;		// 現在所有註解都對齊了
int longer_var = 20;	// 這個註解位置也正確了
```

## 問題分析

### 可能出現的問題

1. **視覺對齊不一致**：不同編輯器的 tab 寬度設定不同（通常 2、4、8 字符）
2. **程式碼可讀性降低**：註解無法整齊對齊，影響代碼美觀
3. **維護困難**：混用造成編輯時對齊混亂，團隊協作問題
4. **跨瀏覽器差異**：不同瀏覽器對 tab 的預設處理不同

### 技術修復方案

在 CSS 中添加了以下設定：

```css
tab-size: 4;           /* 現代瀏覽器 */
-moz-tab-size: 4;      /* Firefox 支援 */
-o-tab-size: 4;        /* Opera 支援 */
```

### 預期修復效果

修復後應該確保：
- ✅ 所有註解在網頁上顯示時對齊一致
- ✅ 不受原始碼中 tab/space 混用影響  
- ✅ 保持程式碼的可讀性和美觀性
- ✅ 跨瀏覽器顯示效果統一
- ✅ 支援各種代碼高亮主題
