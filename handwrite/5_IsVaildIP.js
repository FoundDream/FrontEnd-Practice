// IPv4：必须是 4 段，用 . 分隔；每段是 0 到 255 的十进制数；
// 不允许前导零（除非这个段就是单个字符 '0'）
// 不允许空段、负号、加号、小数点、空格等
// IPv6：必须是 8 段，用 : 分隔；每段是 1 到 4 位的十六进制（0-9, a-f, A-F）
// 不允许空段（本实现不支持 :: 压缩写法）
// 不允许前导 +/-、超出 4 位等

const isIPv4 = (ip) => {
  if (ip.includes(":")) return false;

  const parts = ip.split(".");
  if (parts.length !== 4) return false;
  for (const part of parts) {
    if (part.length === 0 || part.length > 3) return false;
    if (part.length > 1 && part[0] === "0") return false;
    if (!/^\d+$/.test(part)) return false;

    const num = Number(part);
    if (num < 0 || num > 255) return false;
  }

  return true;
};

const isIPv6 = (ip) => {
  if (ip.includes(".")) return false;

  const parts = ip.split(":");

  if (parts.length !== 8) return false;
  const hexRE = /^[0-9a-fA-F]{1,4}$/;

  for (const part of parts) {
    if (part.length === 0) return false;
    if (!hexRE.test(part)) return false;
  }
  return true;
};

function validIPAddress(queryIP) {
  if (isIPv4(queryIP)) return "IPv4";
  if (isIPv6(queryIP)) return "IPv6";
  return "Neither";
}

const tests = [
  // IPv4 正确
  ["172.16.254.1", "IPv4"],
  ["0.0.0.0", "IPv4"],
  ["255.255.255.255", "IPv4"],

  // IPv4 错误
  ["256.256.256.256", "Neither"],
  ["1e1.4.5.6", "Neither"],
  ["01.1.1.1", "Neither"], // 前导零
  ["1..1.1", "Neither"], // 空段
  ["1.1.1.", "Neither"], // 末尾分隔
  ["1.1.1.1 ", "Neither"], // 空格
  ["-1.1.1.1", "Neither"],

  // IPv6 正确（不含压缩）
  ["2001:0db8:85a3:0000:0000:8a2e:0370:7334", "IPv6"],
  ["2001:db8:85a3:0:0:8A2E:0370:7334", "IPv6"],
  ["FFFF:FFFF:FFFF:FFFF:FFFF:FFFF:FFFF:FFFF", "IPv6"],
  ["1:2:3:4:5:6:7:8", "IPv6"],

  // IPv6 错误
  ["2001:db8:85a3::8A2E:0370:7334", "Neither"], // 本实现不支持 ::
  ["2001:db8:85a3:0:0:8A2E:0370", "Neither"], // 段数不足
  ["2001:db8:85a3:0:0:8A2E:0370:7334:1234", "Neither"], // 段数过多
  ["2001:db8:85a3:0:0:8A2E:0370:733g", "Neither"], // 非法 hex
  [":1:2:3:4:5:6:7:8", "Neither"], // 空段
];

for (const [ip, expected] of tests) {
  const got = validIPAddress(ip);
  console.log(
    ip,
    "=>",
    got,
    got === expected ? "✓" : `✗ (expected ${expected})`
  );
}
