document.getElementById("obfuscateButton").addEventListener("click", function () {
    const inputCode = document.getElementById("inputCode").value.trim();
    if (!inputCode) {
        alert("Vui lòng nhập mã Lua!");
        return;
    }

    // Tạo biến giả ngẫu nhiên
    function randomVarName() {
        const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
        let name = "";
        for (let i = 0; i < 8; i++) {
            name += chars[Math.floor(Math.random() * chars.length)];
        }
        return name;
    }

    // Mã hóa XOR
    function xorEncrypt(input, key) {
        let output = [];
        for (let i = 0; i < input.length; i++) {
            const charCode = input.charCodeAt(i);
            const keyCode = key.charCodeAt(i % key.length);
            output.push(charCode ^ keyCode);
        }
        return output.join(",");
    }

    // Gộp tất cả vào một dòng
    function toSingleLine(code) {
        return code.replace(/\n/g, " ").replace(/\s+/g, " ");
    }

    const key = "secret_key"; // Khóa mã hóa
    const encrypted = xorEncrypt(inputCode, key);
    const varName = randomVarName();

    // Bảng định nghĩa hàm
    const functionTable = `
        local ${varName}_defs = [[
        v1=string.byte
        v2=string.char
        v3=table.insert
        v4=loadstring
        v5=math.floor
        v6=tonumber
        v7=type
        v8=string.sub
        v9=string.upper
        v10=string.lower
        v11=table.remove
        v12=rawset
        v13=rawget
        v14=math.ceil
        v15=math.random
        v16=math.sqrt
        v17=string.find
        ]]
        loadstring(${varName}_defs)()
    `;

    // Sử dụng các biến trong bảng string_v1 để mã hóa
    const obfuscatedCode = `
        ${functionTable}
        local function decrypt(${varName}, key)
            local numbers = {}
            for num in ${varName}:gmatch("[^,]+") do
                v3(numbers, v6(num)) -- Dùng v3 = table.insert, v6 = tonumber
            end
            local output = {}
            for i = 1, #numbers do
                local char = numbers[i]
                local keyChar = key:v1((i - 1) % #key + 1) -- Dùng v1 = string.byte
                output[i] = v2(char ~ keyChar) -- Dùng v2 = string.char
            end
            return table.concat(output)
        end
        local ${varName} = "${encrypted}"
        local key = "${key}"
        local code = decrypt(${varName}, key)
        v4(code)() -- Dùng v4 = loadstring
    `;

    // Hiển thị mã đã làm rối
    document.getElementById("output").textContent = toSingleLine(obfuscatedCode);
});
