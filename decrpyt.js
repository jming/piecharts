function getDecrypt(hash) {

  var rsa = new RSAKey();

  var n = '9c7ddce42a2557200107200014b2badf';
  var e = '10001';

  rsa.setPublic(n, e);

  var d = '1b671ecb05664c7f130d32d1d89d6fe1';
  var p = 'ed9c79e9bc39efeb';
  var q = 'a89a41751ec197dd';
  var dmp1 = '21f2500c8fa2ab5f';
  var dmq1 = '74efb7e291585809';
  var coeff = '92599868e620560c';

  rsa.setPrivateEx(n, e, d, p, q, dmp1, dmq1, coeff);

  var plaintext = rsa.decrypt(hash);

  return plaintext;

}