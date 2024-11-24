document.getElementById("obfuscateButton").addEventListener("click", function () {
    const inputCode = document.getElementById("inputCode").value.trim();
    if (!inputCode) {
        alert("Vui lòng nhập mã Lua!");
        return;
    }

    function randomVarName() {
        const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
        let name = "";
        for (let i = 0; i < 8; i++) {
            name += chars[Math.floor(Math.random() * chars.length)];
        }
        return name;
    }

    function xorEncrypt(input, key) {
        let output = [];
        for (let i = 0; i < input.length; i++) {
            const charCode = input.charCodeAt(i);
            const keyCode = key.charCodeAt(i % key.length);
            output.push(charCode ^ keyCode);
        }
        return output.join(",");
    }

    function base64Encode(input) {
        return btoa(input);
    }

    function toSingleLine(code) {
        return code.replace(/\n/g, "").replace(/\s+/g, " ");
    }

    const key = randomVarName(); // Tạo khóa ngẫu nhiên
    const encryptedXOR = xorEncrypt(inputCode, key); // Mã hóa XOR
    const encryptedBase64 = base64Encode(encryptedXOR); // Mã hóa Base64
    const varName = randomVarName(); // Tên biến ngẫu nhiên cho dữ liệu

    const header = "This File Obf Make By NTT HUB"; // Dòng bảo vệ
    const headerCheckEncrypted = xorEncrypt(header, key); // Mã hóa dòng kiểm tra

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

    const obfuscatedCode = `
        local function decryptHeader(enc, key)
            local output = {}
            for num in enc:gmatch("[^,]+") do
                v3(output, v2(v6(num) ~ key:v1((#output) % #key + 1)))
            end
            return table.concat(output)
        end

        -- Bảng hàm Lua
        ${functionTable}

        -- Kiểm tra dòng bảo vệ
        local own = "${headerCheckEncrypted}"
        local key = "${key}"
        local decodedHeader = decryptHeader(own, key)
        assert(decodedHeader == "This File Obf Make By NTT HUB", "Header Missing or Altered!")

        -- Giải mã và thực thi mã chính
        local function decrypt(${varName}, key)
            local decoded = "${encryptedBase64}"
            local numbers = {}
            for num in decoded:gsub(".", function(c)
                return v1(c)
            end):gmatch("[^,]+") do
                v3(numbers, v6(num))
            end
            local output = {}
            for i = 1, #numbers do
                local char = numbers[i]
                local keyChar = key:v1((i - 1) % #key + 1)
                output[i] = v2(char ~ keyChar)
            end
            return table.concat(output)
        end
        local ${varName} = "${encryptedBase64}"
        local code = decrypt(${varName}, key)
        v4(code)()
    `;

    document.getElementById("output").textContent = toSingleLine(obfuscatedCode);
});
