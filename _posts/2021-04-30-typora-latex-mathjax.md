---
layout:     post
title:      "轉載-Typora下使用LaTex公式，Jekyll使用Mathjax顯示公式"
subtitle:   "Markdown,blog"
date:       2021-04-30
update:     2025-08-13
author:     "elmagnifico"
header-img: ""
header-bg-css: "linear-gradient(to right, #1e3a8a, #3b82f6);"
catalog:    true
mathjax:    true
tags:
    - 轉載
    - Typora
    - LaTex
    - Jekyll
    - Mathjax
---

> 轉載自Elmagnifico's Blog <br> 原文地址是[https://github.elmagnifico.tech/2021/04/30/Typora-LaTex-Mathjax/](https://github.elmagnifico.tech/2021/04/30/Typora-LaTex-Mathjax/)

## Foreword

寫RVO的時候就發現公式有點處理不了，都是貼圖，然後貼圖大小不好控制，實際看起來也很難看。

搜了一下發現Typora可以直接使用Latex公式，那就很簡單了



## Typora

#### 準備

首先，Typora顯示公式，必須要使用Markdown 擴展語法，啟用內聯公式

![](https://img.allenspace.de/20250902064252_y7pppdm0it.4claondm8v.webp)


#### 使用

使用比較簡單，如果是嵌入在同行中的公式，就用 `$` 開頭即可

如果是獨占一行的公式，就用`$$`開頭

如果用快捷鍵就是`Ctrl-Shift-m`



具體公式語法可以查：

> [https://www.cnblogs.com/wreng/articles/13514391.html](https://www.cnblogs.com/wreng/articles/13514391.html)



#### 測試

獨行公式

```
$$ VO\frac {A } {B }（ { V_B }） $$

```

$$
VO\frac {A } {B }（ { V_B }）
$$

同行公式

```
$ A = \{ \langle G \rangle \vert G \text{ is a connected undirected graph}\} $
```

比如   $ A = \{ \langle G \rangle \vert G \text{ is a connected undirected graph}\} $  



## jekyll 支持公式

#### MathJax

默認的jekyll的markdown是不支持顯示公式的

推薦使用下面的腳本，嵌入到你的post layout中

```html
<script type="text/x-mathjax-config">
    MathJax.Hub.Config({
        tex2jax: {
            inlineMath: [ ["$","$"]],
            skipTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code'],
            processEscapes: true
        }
    });
    MathJax.Hub.Queue(function() {
        var all = MathJax.Hub.getAllJax();
        for (var i = 0; i < all.length; ++i)
            all[i].SourceElement().parentNode.className += ' has-jax';
    });
</script>

<script src="https://cdn.bootcdn.net/ajax/libs/mathjax/2.7.5/MathJax.js?config=TeX-MML-AM_CHTML"></script>
```

這樣嵌入的公式可以右鍵，有很多選項和操作



或者單獨提出來作為一個include的文件

![](https://img.allenspace.de/20250902064416_mu4hn1pyto.92qjn2kj56.webp)

#### page.mathjax

因為這個mathjax挺消耗性能的，而且比較慢，如果文章里根本沒有公式，最好就別加載了。

對應的最好再添加一個開關，如果文章里用了公式，多添加一筆即可。

```html
<!-- add support for mathjax by voleking-->
{% raw %}
{% if page.mathjax %}
  {% include mathjax_support.html %}
{% endif %}
{% endraw %}
```





文章開頭添加上mathjax:    true即可，如下：

```
layout:     post
title:      "RVO算法詳解"
subtitle:   "RVO2,OV"
date:       2021-04-19
update:     2021-04-29
author:     "elmagnifico"
header-img: "img/zerotier.jpg"
catalog:    true
mathjax:    true
tags:
    - PathFind
```



## 花括號問題

#### Typora和web顯示不兼容

由於是jekyll，他要優先解析post的內容，而定位又是通過花括號來完成的，如果正文或者哪里帶有花括號，容易出現報錯的情況，一般這種情況下就要用下面的方式來強制不解析。

```
# 去掉{和%的空格
{ % raw % }

xxx...

{ % endraw % }
```

但是當jekyll遇到markdown，又遇到latex的時候，這個花括號就非常覆雜了



比如我們想要顯示下面的這個公式

$ \Sigma= \lbrace 0, 1 \rbrace $

如果你直接輸入，下面的內容，在Typora里顯示是正確的

```
$ \Sigma= \{ 0, 1 \} $
```

顯示：$ \Sigma= \lbrace 0, 1 \rbrace $



但是如果你直接去對應的頁面查看，就會發現顯示的是$ \Sigma=  0, 1  $，你的花括號都被吃了

這種情況下就算使用raw也無法阻擋jekyll和markdow會解析花括號的問題，要防止解析必須套2層

也就是說你必須寫出下面這樣，web頁面解析顯示才能正確

```
$ \Sigma= \\{ 0, 1 \\} $
```

可是這樣在Typora中又會顯示錯誤，類似於這樣：

![](https://img.allenspace.de/20250902064523_ax4vzrr6cs.6m4b85kgk5.webp)

#### 解決辦法

要解決這個問題，也很簡單

使用 `\brace` 代替花括號，還是上面的公式，我們寫出下面這樣：

```
$ \Sigma= \lbrace 0, 1 \rbrace $
```

然後你就看到$ \Sigma= \lbrace 0, 1 \rbrace $ 無論是Typora還是web顯示，都是正確的了



類似的一些符號，由於潛在的解析問題，都可以通過直接輸入對應的符號名稱來代替，從而解決符號不兼容的情況

這樣能讓Typora和web解析後的保持一致就很舒服了。



## Summary

一開始沒想到符號代替，找了半天代碼的解決辦法，發現都不行。



## Quote

> [http://cn.voidcc.com/question/p-bzhlwrjt-py.html](http://cn.voidcc.com/question/p-bzhlwrjt-py.html)
>
> [https://github.com/Huxpro/huxpro.github.io/pull/398/commits](https://github.com/Huxpro/huxpro.github.io/pull/398/commits)
>
> [https://brucezhaor.github.io/blog/2016/01/07/Mathjax-with-jekyll/](https://brucezhaor.github.io/blog/2016/01/07/Mathjax-with-jekyll/)
>
> [https://www.zhihu.com/question/343751976/answer/809450524](https://www.zhihu.com/question/343751976/answer/809450524)
>
> [https://segmentfault.com/q/1010000007941694/a-1020000011904225](https://segmentfault.com/q/1010000007941694/a-1020000011904225)
>
> [https://www.bilibili.com/read/cv1578688/](https://www.bilibili.com/read/cv1578688/)
