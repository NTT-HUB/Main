local function base64Decode(data)
    local b = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
    data = string.gsub(data, '[^' .. b .. '=]', '')
    return (data:gsub('.', function(x)
        if x == '=' then return '' end
        local r, f = '', (b:find(x) - 1)
        for i = 6, 1, -1 do r = r .. (f % 2 ^ i - f % 2 ^ (i - 1) > 0 and '1' or '0') end
        return r
    end):gsub('%d%d%d?%d?%d?%d?%d?%d?', function(x)
        if #x ~= 8 then return '' end
        local c = 0
        for i = 1, 8 do c = c + (x:sub(i, i) == '1' and 2 ^ (8 - i) or 0) end
        return string.char(c)
    end))
end

local function decryptHeader(enc, key)
    local numbers = {}
    for num in enc:gmatch("[^,]+") do
        table.insert(numbers, tonumber(num))
    end
    local output = {}
    for i = 1, #numbers do
        local char = numbers[i]
        local keyChar = key:byte((i - 1) % #key + 1)
        output[i] = string.char(char ~ keyChar)
    end
    return table.concat(output)
end

local function decrypt(encrypted, key)
    local decoded = base64Decode(encrypted)
    local numbers = {}
    for i = 1, #decoded do
        numbers[#numbers + 1] = string.byte(decoded:sub(i, i))
    end
    local output = {}
    for i = 1, #numbers do
        local char = numbers[i]
        local keyChar = key:byte((i - 1) % #key + 1)
        output[i] = string.char(char ~ keyChar)
    end
    return table.concat(output)
end

local defs = [[
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
loadstring(defs)()

-- Header check
local own = "19,37,5,16,122,8,11,2,34,109,35,1,60,110,47,15,44,40,76,33,35,110,44,58,19,109,36,54,24"
local key = "GMlcZNbn"
local decodedHeader = decryptHeader(own, key)
assert(decodedHeader == "This File Obf Make By NTT HUB", "Header Missing or Altered!")

-- Decrypt and execute
local encrypted = "MjMsNjMsNSwxMyw0NiwxMDIsODMsOTUsMTEw"
local code = decrypt(encrypted, key)
loadstring(code)()
