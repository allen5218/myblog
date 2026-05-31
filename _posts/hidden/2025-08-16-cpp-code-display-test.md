---
layout:     post
title:      "C/C++ 代碼顯示測試"
subtitle:   "測試 C/C++ 代碼塊在手機端的顯示修復"
date:       2025-08-16
author:     "Claude"
header-img: "https://img.allenspace.de/20250830050705_evvnbpcj0l.32idicxze0.webp"
catalog: true
tags:
    - 測試
    - C++
    - 代碼顯示
---

> 這篇測試文章由 Claude 生成，用於驗證新功能的運作是否正常，以及頁面樣式是否正確顯示。我選擇保留這些內容，作為未來回顧的足跡

這篇文章專門測試 C/C++ 代碼塊在各種設備上的顯示效果，特別是長代碼行的處理。

### 測試案例 1：長函數聲明

```cpp
// 這是一個非常長的函數聲明，用來測試代碼行過長時的顯示效果
int calculateVeryLongFunctionNameWithManyParametersForTestingPurpose(int firstParameter, int secondParameter, double thirdParameter, const std::string& fourthParameter, bool fifthParameter);
```

### 測試案例 2：長註解

```c
#include <stdio.h>
#include <stdlib.h>

int main() {
    // 這是一個非常長的單行註解，用來測試在手機端或小屏幕設備上的顯示效果，當註解內容超過容器寬度時是否會正確處理
    printf("Hello, World!\n");
    
    /* 這是一個多行註解的開始，內容同樣很長，用來測試多行註解在不同設備上的顯示效果，確保不會溢出容器邊界 */
    
    return 0;
}
```

### 測試案例 3：複雜的 C++ 模板代碼

```cpp
#include <iostream>
#include <vector>
#include <algorithm>
#include <functional>

template<typename T, typename Predicate>
std::vector<T> filterAndTransformVectorWithVeryLongTemplateNameForTestingPurpose(const std::vector<T>& input, Predicate pred, std::function<T(const T&)> transform) {
    std::vector<T> result;
    std::copy_if(input.begin(), input.end(), std::back_inserter(result), pred);
    std::transform(result.begin(), result.end(), result.begin(), transform);
    return result;
}

int main() {
    std::vector<int> numbers = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10};
    
    // 使用 lambda 表達式進行過濾和轉換，這行代碼特別長用來測試水平滾動
    auto result = filterAndTransformVectorWithVeryLongTemplateNameForTestingPurpose<int>(numbers, [](int x) { return x % 2 == 0; }, [](int x) { return x * x; });
    
    for (const auto& num : result) {
        std::cout << num << " ";
    }
    std::cout << std::endl;
    
    return 0;
}
```

### 測試案例 4：包含長字符串的代碼

```c
#include <stdio.h>
#include <string.h>

int main() {
    char very_long_string[] = "This is a very long string that is designed to test how the code display handles extremely long lines of code that might overflow the container boundaries on mobile devices or small screens";
    
    printf("String length: %zu\n", strlen(very_long_string));
    printf("Content: %s\n", very_long_string);
    
    return 0;
}
```

### 測試案例 5：複雜的宏定義

```cpp
#define VERY_LONG_MACRO_NAME_FOR_TESTING_PURPOSE(x, y, z) \
    do { \
        if ((x) > 0 && (y) > 0 && (z) > 0) { \
            printf("All parameters are positive: x=%d, y=%d, z=%d\n", (x), (y), (z)); \
        } else { \
            printf("At least one parameter is not positive: x=%d, y=%d, z=%d\n", (x), (y), (z)); \
        } \
    } while(0)

int main() {
    VERY_LONG_MACRO_NAME_FOR_TESTING_PURPOSE(10, 20, 30);
    VERY_LONG_MACRO_NAME_FOR_TESTING_PURPOSE(-5, 15, 25);
    return 0;
}
```

### 測試案例 6：長 URL 和路徑

```cpp
#include <iostream>
#include <string>

int main() {
    // 測試包含長 URL 的註解
    // 參考資料: https://this-is-a-very-long-url-example-for-testing-code-display-on-mobile-devices.com/documentation/cpp/advanced-topics/template-metaprogramming/
    
    std::string file_path = "/very/long/file/path/that/might/cause/display/issues/on/mobile/devices/example_file_with_very_long_name_for_testing.cpp";
    
    std::cout << "Processing file: " << file_path << std::endl;
    
    return 0;
}
```

---

## 修復說明

本次修復針對 C/C++ 代碼顯示問題，在以下文件中進行了修改：

### 1. `less/hux-blog.less`
```less
// Fix for code overflow on mobile devices
.highlight pre {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}
```

### 2. `less/highlight.less`
```less
.highlighter-rouge .highlight {
  pre {
    // 原有樣式保持不變
    overflow-x: auto;                    // 新增：允許水平滾動
    -webkit-overflow-scrolling: touch;   // 新增：iOS 滾動優化
  }
}
```

## 修復效果

1. **保留原有樣式**：代碼的顏色、字體、行高等視覺效果完全不變
2. **解決溢出問題**：長代碼行不再超出容器邊界
3. **提供滾動功能**：可以水平滾動查看完整代碼
4. **優化手機體驗**：在移動設備上提供流暢的滾動體驗

## 測試方法

1. 在桌面瀏覽器中查看此頁面
2. 使用開發者工具切換到手機視圖
3. 觀察上述代碼塊是否出現水平滾動條
4. 在手機上測試滑動查看完整代碼
5. 確認代碼不會超出容器邊界
