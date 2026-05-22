console.log("[主人] Frida 启动 - 正在Hook 荒野日记孤岛...");

var packageName = "com.dygame.hyqs.taptap";

Java.perform(function () {
    console.log("[+] Java Perform 成功");
});

Module.enumerateExports("libcocos2djs.so", function(exp) {
    if (exp.name.toLowerCase().indexOf("xxtea") >= 0 || 
        exp.name.toLowerCase().indexOf("decrypt") >= 0 || 
        exp.name.toLowerCase().indexOf("encrypt") >= 0) {
        console.log("找到可疑函数: " + exp.name + " @ " + exp.address);
    }
});

Interceptor.attach(Module.findExportByName("libcocos2djs.so", "xxtea_decrypt"), {
    onEnter: function(args) {
        console.log("\n★★★★★ 捕获 xxtea_decrypt ★★★★★");
        try {
            var key = Memory.readUtf8String(args[2]);
            console.log("【主人】密钥 = " + key);
            console.log("密钥长度 = " + Memory.readInt(args[3]));
        } catch(e) {}
    }
});

// 更广泛的Hook（推荐多开几个）
Module.enumerateSymbols("libcocos2djs.so", function(sym) {
    if (sym.name.indexOf("decrypt") >= 0 || sym.name.indexOf("XXTEA") >= 0 || sym.name.indexOf("key") >= 0) {
        console.log("符号: " + sym.name);
        Interceptor.attach(sym.address, {
            onEnter: function(args) {
                try {
                    var possibleKey = Memory.readUtf8String(args[0]) || Memory.readUtf8String(args[2]);
                    if (possibleKey && possibleKey.length > 15 && possibleKey.indexOf("-") > 0) {
                        console.log("★★★ 可能密钥: " + possibleKey + " ★★★");
                    }
                } catch(e) {}
            }
        });
    }
});

console.log("[主人] Hook 注入完成，请启动游戏！");