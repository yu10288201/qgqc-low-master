var QR = (function () {

  // alignment pattern
  var adelta = [
    0, 11, 15, 19, 23, 27, 31,
    16, 18, 20, 22, 24, 26, 28, 20, 22, 24, 24, 26, 28, 28, 22, 24, 24,
    26, 26, 28, 28, 24, 24, 26, 26, 26, 28, 28, 24, 26, 26, 26, 28, 28
  ];

  // version block
  var vpat = [
    0xc94, 0x5bc, 0xa99, 0x4d3, 0xbf6, 0x762, 0x847, 0x60d,
    0x928, 0xb78, 0x45d, 0xa17, 0x532, 0x9a6, 0x683, 0x8c9,
    0x7ec, 0xec4, 0x1e1, 0xfab, 0x08e, 0xc1a, 0x33f, 0xd75,
    0x250, 0x9d5, 0x6f0, 0x8ba, 0x79f, 0xb0b, 0x42e, 0xa64,
    0x541, 0xc69
  ];

  // final format bits with mask: level << 3 | mask
  var fmtword = [
    0x77c4, 0x72f3, 0x7daa, 0x789d, 0x662f, 0x6318, 0x6c41, 0x6976,    //L
    0x5412, 0x5125, 0x5e7c, 0x5b4b, 0x45f9, 0x40ce, 0x4f97, 0x4aa0,    //M
    0x355f, 0x3068, 0x3f31, 0x3a06, 0x24b4, 0x2183, 0x2eda, 0x2bed,    //Q
    0x1689, 0x13be, 0x1ce7, 0x19d0, 0x0762, 0x0255, 0x0d0c, 0x083b    //H
  ];

  // 4 per version: number of blocks 1,2; data width; ecc width
  var eccblocks = [
    1, 0, 19, 7, 1, 0, 16, 10, 1, 0, 13, 13, 1, 0, 9, 17,
    1, 0, 34, 10, 1, 0, 28, 16, 1, 0, 22, 22, 1, 0, 16, 28,
    1, 0, 55, 15, 1, 0, 44, 26, 2, 0, 17, 18, 2, 0, 13, 22,
    1, 0, 80, 20, 2, 0, 32, 18, 2, 0, 24, 26, 4, 0, 9, 16,
    1, 0, 108, 26, 2, 0, 43, 24, 2, 2, 15, 18, 2, 2, 11, 22,
    2, 0, 68, 18, 4, 0, 27, 16, 4, 0, 19, 24, 4, 0, 15, 28,
    2, 0, 78, 20, 4, 0, 31, 18, 2, 4, 14, 18, 4, 1, 13, 26,
    2, 0, 97, 24, 2, 2, 38, 22, 4, 2, 18, 22, 4, 2, 14, 26,
    2, 0, 116, 30, 3, 2, 36, 22, 4, 4, 16, 20, 4, 4, 12, 24,
    2, 2, 68, 18, 4, 1, 43, 26, 6, 2, 19, 24, 6, 2, 15, 28,
    4, 0, 81, 20, 1, 4, 50, 30, 4, 4, 22, 28, 3, 8, 12, 24,
    2, 2, 92, 24, 6, 2, 36, 22, 4, 6, 20, 26, 7, 4, 14, 28,
    4, 0, 107, 26, 8, 1, 37, 22, 8, 4, 20, 24, 12, 4, 11, 22,
    3, 1, 115, 30, 4, 5, 40, 24, 11, 5, 16, 20, 11, 5, 12, 24,
    5, 1, 87, 22, 5, 5, 41, 24, 5, 7, 24, 30, 11, 7, 12, 24,
    5, 1, 98, 24, 7, 3, 45, 28, 15, 2, 19, 24, 3, 13, 15, 30,
    1, 5, 107, 28, 10, 1, 46, 28, 1, 15, 22, 28, 2, 17, 14, 28,
    5, 1, 120, 30, 9, 4, 43, 26, 17, 1, 22, 28, 2, 19, 14, 28,
    3, 4, 113, 28, 3, 11, 44, 26, 17, 4, 21, 26, 9, 16, 13, 26,
    3, 5, 107, 28, 3, 13, 41, 26, 15, 5, 24, 30, 15, 10, 15, 28,
    4, 4, 116, 28, 17, 0, 42, 26, 17, 6, 22, 28, 19, 6, 16, 30,
    2, 7, 111, 28, 17, 0, 46, 28, 7, 16, 24, 30, 34, 0, 13, 24,
    4, 5, 121, 30, 4, 14, 47, 28, 11, 14, 24, 30, 16, 14, 15, 30,
    6, 4, 117, 30, 6, 14, 45, 28, 11, 16, 24, 30, 30, 2, 16, 30,
    8, 4, 106, 26, 8, 13, 47, 28, 7, 22, 24, 30, 22, 13, 15, 30,
    10, 2, 114, 28, 19, 4, 46, 28, 28, 6, 22, 28, 33, 4, 16, 30,
    8, 4, 122, 30, 22, 3, 45, 28, 8, 26, 23, 30, 12, 28, 15, 30,
    3, 10, 117, 30, 3, 23, 45, 28, 4, 31, 24, 30, 11, 31, 15, 30,
    7, 7, 116, 30, 21, 7, 45, 28, 1, 37, 23, 30, 19, 26, 15, 30,
    5, 10, 115, 30, 19, 10, 47, 28, 15, 25, 24, 30, 23, 25, 15, 30,
    13, 3, 115, 30, 2, 29, 46, 28, 42, 1, 24, 30, 23, 28, 15, 30,
    17, 0, 115, 30, 10, 23, 46, 28, 10, 35, 24, 30, 19, 35, 15, 30,
    17, 1, 115, 30, 14, 21, 46, 28, 29, 19, 24, 30, 11, 46, 15, 30,
    13, 6, 115, 30, 14, 23, 46, 28, 44, 7, 24, 30, 59, 1, 16, 30,
    12, 7, 121, 30, 12, 26, 47, 28, 39, 14, 24, 30, 22, 41, 15, 30,
    6, 14, 121, 30, 6, 34, 47, 28, 46, 10, 24, 30, 2, 64, 15, 30,
    17, 4, 122, 30, 29, 14, 46, 28, 49, 10, 24, 30, 24, 46, 15, 30,
    4, 18, 122, 30, 13, 32, 46, 28, 48, 14, 24, 30, 42, 32, 15, 30,
    20, 4, 117, 30, 40, 7, 47, 28, 43, 22, 24, 30, 10, 67, 15, 30,
    19, 6, 118, 30, 18, 31, 47, 28, 34, 34, 24, 30, 20, 61, 15, 30
  ];

  // Galois field log table
  var glog = [
    0xff, 0x00, 0x01, 0x19, 0x02, 0x32, 0x1a, 0xc6, 0x03, 0xdf, 0x33, 0xee, 0x1b, 0x68, 0xc7, 0x4b,
    0x04, 0x64, 0xe0, 0x0e, 0x34, 0x8d, 0xef, 0x81, 0x1c, 0xc1, 0x69, 0xf8, 0xc8, 0x08, 0x4c, 0x71,
    0x05, 0x8a, 0x65, 0x2f, 0xe1, 0x24, 0x0f, 0x21, 0x35, 0x93, 0x8e, 0xda, 0xf0, 0x12, 0x82, 0x45,
    0x1d, 0xb5, 0xc2, 0x7d, 0x6a, 0x27, 0xf9, 0xb9, 0xc9, 0x9a, 0x09, 0x78, 0x4d, 0xe4, 0x72, 0xa6,
    0x06, 0xbf, 0x8b, 0x62, 0x66, 0xdd, 0x30, 0xfd, 0xe2, 0x98, 0x25, 0xb3, 0x10, 0x91, 0x22, 0x88,
    0x36, 0xd0, 0x94, 0xce, 0x8f, 0x96, 0xdb, 0xbd, 0xf1, 0xd2, 0x13, 0x5c, 0x83, 0x38, 0x46, 0x40,
    0x1e, 0x42, 0xb6, 0xa3, 0xc3, 0x48, 0x7e, 0x6e, 0x6b, 0x3a, 0x28, 0x54, 0xfa, 0x85, 0xba, 0x3d,
    0xca, 0x5e, 0x9b, 0x9f, 0x0a, 0x15, 0x79, 0x2b, 0x4e, 0xd4, 0xe5, 0xac, 0x73, 0xf3, 0xa7, 0x57,
    0x07, 0x70, 0xc0, 0xf7, 0x8c, 0x80, 0x63, 0x0d, 0x67, 0x4a, 0xde, 0xed, 0x31, 0xc5, 0xfe, 0x18,
    0xe3, 0xa5, 0x99, 0x77, 0x26, 0xb8, 0xb4, 0x7c, 0x11, 0x44, 0x92, 0xd9, 0x23, 0x20, 0x89, 0x2e,
    0x37, 0x3f, 0xd1, 0x5b, 0x95, 0xbc, 0xcf, 0xcd, 0x90, 0x87, 0x97, 0xb2, 0xdc, 0xfc, 0xbe, 0x61,
    0xf2, 0x56, 0xd3, 0xab, 0x14, 0x2a, 0x5d, 0x9e, 0x84, 0x3c, 0x39, 0x53, 0x47, 0x6d, 0x41, 0xa2,
    0x1f, 0x2d, 0x43, 0xd8, 0xb7, 0x7b, 0xa4, 0x76, 0xc4, 0x17, 0x49, 0xec, 0x7f, 0x0c, 0x6f, 0xf6,
    0x6c, 0xa1, 0x3b, 0x52, 0x29, 0x9d, 0x55, 0xaa, 0xfb, 0x60, 0x86, 0xb1, 0xbb, 0xcc, 0x3e, 0x5a,
    0xcb, 0x59, 0x5f, 0xb0, 0x9c, 0xa9, 0xa0, 0x51, 0x0b, 0xf5, 0x16, 0xeb, 0x7a, 0x75, 0x2c, 0xd7,
    0x4f, 0xae, 0xd5, 0xe9, 0xe6, 0xe7, 0xad, 0xe8, 0x74, 0xd6, 0xf4, 0xea, 0xa8, 0x50, 0x58, 0xaf
  ];

  // Galios field exponent table
  var gexp = [
    0x01, 0x02, 0x04, 0x08, 0x10, 0x20, 0x40, 0x80, 0x1d, 0x3a, 0x74, 0xe8, 0xcd, 0x87, 0x13, 0x26,
    0x4c, 0x98, 0x2d, 0x5a, 0xb4, 0x75, 0xea, 0xc9, 0x8f, 0x03, 0x06, 0x0c, 0x18, 0x30, 0x60, 0xc0,
    0x9d, 0x27, 0x4e, 0x9c, 0x25, 0x4a, 0x94, 0x35, 0x6a, 0xd4, 0xb5, 0x77, 0xee, 0xc1, 0x9f, 0x23,
    0x46, 0x8c, 0x05, 0x0a, 0x14, 0x28, 0x50, 0xa0, 0x5d, 0xba, 0x69, 0xd2, 0xb9, 0x6f, 0xde, 0xa1,
    0x5f, 0xbe, 0x61, 0xc2, 0x99, 0x2f, 0x5e, 0xbc, 0x65, 0xca, 0x89, 0x0f, 0x1e, 0x3c, 0x78, 0xf0,
    0xfd, 0xe7, 0xd3, 0xbb, 0x6b, 0xd6, 0xb1, 0x7f, 0xfe, 0xe1, 0xdf, 0xa3, 0x5b, 0xb6, 0x71, 0xe2,
    0xd9, 0xaf, 0x43, 0x86, 0x11, 0x22, 0x44, 0x88, 0x0d, 0x1a, 0x34, 0x68, 0xd0, 0xbd, 0x67, 0xce,
    0x81, 0x1f, 0x3e, 0x7c, 0xf8, 0xed, 0xc7, 0x93, 0x3b, 0x76, 0xec, 0xc5, 0x97, 0x33, 0x66, 0xcc,
    0x85, 0x17, 0x2e, 0x5c, 0xb8, 0x6d, 0xda, 0xa9, 0x4f, 0x9e, 0x21, 0x42, 0x84, 0x15, 0x2a, 0x54,
    0xa8, 0x4d, 0x9a, 0x29, 0x52, 0xa4, 0x55, 0xaa, 0x49, 0x92, 0x39, 0x72, 0xe4, 0xd5, 0xb7, 0x73,
    0xe6, 0xd1, 0xbf, 0x63, 0xc6, 0x91, 0x3f, 0x7e, 0xfc, 0xe5, 0xd7, 0xb3, 0x7b, 0xf6, 0xf1, 0xff,
    0xe3, 0xdb, 0xab, 0x4b, 0x96, 0x31, 0x62, 0xc4, 0x95, 0x37, 0x6e, 0xdc, 0xa5, 0x57, 0xae, 0x41,
    0x82, 0x19, 0x32, 0x64, 0xc8, 0x8d, 0x07, 0x0e, 0x1c, 0x38, 0x70, 0xe0, 0xdd, 0xa7, 0x53, 0xa6,
    0x51, 0xa2, 0x59, 0xb2, 0x79, 0xf2, 0xf9, 0xef, 0xc3, 0x9b, 0x2b, 0x56, 0xac, 0x45, 0x8a, 0x09,
    0x12, 0x24, 0x48, 0x90, 0x3d, 0x7a, 0xf4, 0xf5, 0xf7, 0xf3, 0xfb, 0xeb, 0xcb, 0x8b, 0x0b, 0x16,
    0x2c, 0x58, 0xb0, 0x7d, 0xfa, 0xe9, 0xcf, 0x83, 0x1b, 0x36, 0x6c, 0xd8, 0xad, 0x47, 0x8e, 0x00
  ];

  // Working buffers:
  // data input and ecc append, image working buffer, fixed part of image, run lengths for badness
  var strinbuf = [], eccbuf = [], qrframe = [], framask = [], rlens = [];
  // Control values - width is based on version, last 4 are from table.
  var version, width, neccblk1, neccblk2, datablkw, eccblkwid;
  var ecclevel = 2;
  // set bit to indicate cell in qrframe is immutable.  symmetric around diagonal
  function setmask(x, y) {
    var bt;
    if (x > y) {
      bt = x;
      x = y;
      y = bt;
    }
    // y*y = 1+3+5...
    bt = y;
    bt *= y;
    bt += y;
    bt >>= 1;
    bt += x;
    framask[bt] = 1;
  }

  // enter alignment pattern - black to qrframe, white to mask (later black frame merged to mask)
  function putalign(x, y) {
    var j;

    qrframe[x + width * y] = 1;
    for (j = -2; j < 2; j++) {
      qrframe[(x + j) + width * (y - 2)] = 1;
      qrframe[(x - 2) + width * (y + j + 1)] = 1;
      qrframe[(x + 2) + width * (y + j)] = 1;
      qrframe[(x + j + 1) + width * (y + 2)] = 1;
    }
    for (j = 0; j < 2; j++) {
      setmask(x - 1, y + j);
      setmask(x + 1, y - j);
      setmask(x - j, y - 1);
      setmask(x + j, y + 1);
    }
  }

  //========================================================================
  // Reed Solomon error correction
  // exponentiation mod N
  function modnn(x) {
    while (x >= 255) {
      x -= 255;
      x = (x >> 8) + (x & 255);
    }
    return x;
  }

  var genpoly = [];

  // Calculate and append ECC data to data block.  Block is in strinbuf, indexes to buffers given.
  function appendrs(data, dlen, ecbuf, eclen) {
    var i, j, fb;

    for (i = 0; i < eclen; i++)
      strinbuf[ecbuf + i] = 0;
    for (i = 0; i < dlen; i++) {
      fb = glog[strinbuf[data + i] ^ strinbuf[ecbuf]];
      if (fb != 255)     /* fb term is non-zero */
        for (j = 1; j < eclen; j++)
          strinbuf[ecbuf + j - 1] = strinbuf[ecbuf + j] ^ gexp[modnn(fb + genpoly[eclen - j])];
      else
        for (j = ecbuf; j < ecbuf + eclen; j++)
          strinbuf[j] = strinbuf[j + 1];
      strinbuf[ecbuf + eclen - 1] = fb == 255 ? 0 : gexp[modnn(fb + genpoly[0])];
    }
  }

  //========================================================================
  // Frame data insert following the path rules

  // check mask - since symmetrical use half.
  function ismasked(x, y) {
    var bt;
    if (x > y) {
      bt = x;
      x = y;
      y = bt;
    }
    bt = y;
    bt += y * y;
    bt >>= 1;
    bt += x;
    return framask[bt];
  }

  //========================================================================
  //  Apply the selected mask out of the 8.
  function applymask(m) {
    var x, y, r3x, r3y;

    switch (m) {
      case 0:
        for (y = 0; y < width; y++)
          for (x = 0; x < width; x++)
            if (!((x + y) & 1) && !ismasked(x, y))
              qrframe[x + y * width] ^= 1;
        break;
      case 1:
        for (y = 0; y < width; y++)
          for (x = 0; x < width; x++)
            if (!(y & 1) && !ismasked(x, y))
              qrframe[x + y * width] ^= 1;
        break;
      case 2:
        for (y = 0; y < width; y++)
          for (r3x = 0, x = 0; x < width; x++ , r3x++) {
            if (r3x == 3)
              r3x = 0;
            if (!r3x && !ismasked(x, y))
              qrframe[x + y * width] ^= 1;
          }
        break;
      case 3:
        for (r3y = 0, y = 0; y < width; y++ , r3y++) {
          if (r3y == 3)
            r3y = 0;
          for (r3x = r3y, x = 0; x < width; x++ , r3x++) {
            if (r3x == 3)
              r3x = 0;
            if (!r3x && !ismasked(x, y))
              qrframe[x + y * width] ^= 1;
          }
        }
        break;
      case 4:
        for (y = 0; y < width; y++)
          for (r3x = 0, r3y = ((y >> 1) & 1), x = 0; x < width; x++ , r3x++) {
            if (r3x == 3) {
              r3x = 0;
              r3y = !r3y;
            }
            if (!r3y && !ismasked(x, y))
              qrframe[x + y * width] ^= 1;
          }
        break;
      case 5:
        for (r3y = 0, y = 0; y < width; y++ , r3y++) {
          if (r3y == 3)
            r3y = 0;
          for (r3x = 0, x = 0; x < width; x++ , r3x++) {
            if (r3x == 3)
              r3x = 0;
            if (!((x & y & 1) + !(!r3x | !r3y)) && !ismasked(x, y))
              qrframe[x + y * width] ^= 1;
          }
        }
        break;
      case 6:
        for (r3y = 0, y = 0; y < width; y++ , r3y++) {
          if (r3y == 3)
            r3y = 0;
          for (r3x = 0, x = 0; x < width; x++ , r3x++) {
            if (r3x == 3)
              r3x = 0;
            if (!(((x & y & 1) + (r3x && (r3x == r3y))) & 1) && !ismasked(x, y))
              qrframe[x + y * width] ^= 1;
          }
        }
        break;
      case 7:
        for (r3y = 0, y = 0; y < width; y++ , r3y++) {
          if (r3y == 3)
            r3y = 0;
          for (r3x = 0, x = 0; x < width; x++ , r3x++) {
            if (r3x == 3)
              r3x = 0;
            if (!(((r3x && (r3x == r3y)) + ((x + y) & 1)) & 1) && !ismasked(x, y))
              qrframe[x + y * width] ^= 1;
          }
        }
        break;
    }
    return;
  }

  // Badness coefficients.
  var N1 = 3, N2 = 3, N3 = 40, N4 = 10;

  // Using the table of the length of each run, calculate the amount of bad image 
  // - long runs or those that look like finders; called twice, once each for X and Y
  function badruns(length) {
    var i;
    var runsbad = 0;
    for (i = 0; i <= length; i++)
      if (rlens[i] >= 5)
        runsbad += N1 + rlens[i] - 5;
    // BwBBBwB as in finder
    for (i = 3; i < length - 1; i += 2)
      if (rlens[i - 2] == rlens[i + 2]
        && rlens[i + 2] == rlens[i - 1]
        && rlens[i - 1] == rlens[i + 1]
        && rlens[i - 1] * 3 == rlens[i]
        // white around the black pattern? Not part of spec
        && (rlens[i - 3] == 0 // beginning
          || i + 3 > length  // end
          || rlens[i - 3] * 3 >= rlens[i] * 4 || rlens[i + 3] * 3 >= rlens[i] * 4)
      )
        runsbad += N3;
    return runsbad;
  }

  // Calculate how bad the masked image is - blocks, imbalance, runs, or finders.
  function badcheck() {
    var x, y, h, b, b1;
    var thisbad = 0;
    var bw = 0;

    // blocks of same color.
    for (y = 0; y < width - 1; y++)
      for (x = 0; x < width - 1; x++)
        if ((qrframe[x + width * y] && qrframe[(x + 1) + width * y]
          && qrframe[x + width * (y + 1)] && qrframe[(x + 1) + width * (y + 1)]) // all black
          || !(qrframe[x + width * y] || qrframe[(x + 1) + width * y]
            || qrframe[x + width * (y + 1)] || qrframe[(x + 1) + width * (y + 1)])) // all white
          thisbad += N2;

    // X runs
    for (y = 0; y < width; y++) {
      rlens[0] = 0;
      for (h = b = x = 0; x < width; x++) {
        if ((b1 = qrframe[x + width * y]) == b)
          rlens[h]++;
        else
          rlens[++h] = 1;
        b = b1;
        bw += b ? 1 : -1;
      }
      thisbad += badruns(h);
    }

    // black/white imbalance
    if (bw < 0)
      bw = -bw;

    var big = bw;
    var count = 0;
    big += big << 2;
    big <<= 1;
    while (big > width * width)
      big -= width * width, count++;
    thisbad += count * N4;

    // Y runs
    for (x = 0; x < width; x++) {
      rlens[0] = 0;
      for (h = b = y = 0; y < width; y++) {
        if ((b1 = qrframe[x + width * y]) == b)
          rlens[h]++;
        else
          rlens[++h] = 1;
        b = b1;
      }
      thisbad += badruns(h);
    }
    return thisbad;
  }

  function genframe(instring) {
    var x, y, k, t, v, i, j, m;

    // find the smallest version that fits the string
    t = instring.length;
    version = 0;
    do {
      version++;
      k = (ecclevel - 1) * 4 + (version - 1) * 16;
      neccblk1 = eccblocks[k++];
      neccblk2 = eccblocks[k++];
      datablkw = eccblocks[k++];
      eccblkwid = eccblocks[k];
      k = datablkw * (neccblk1 + neccblk2) + neccblk2 - 3 + (version <= 9);
      if (t <= k)
        break;
    } while (version < 40);

    // FIXME - insure that it fits insted of being truncated
    width = 17 + 4 * version;

    // allocate, clear and setup data structures
    v = datablkw + (datablkw + eccblkwid) * (neccblk1 + neccblk2) + neccblk2;
    for (t = 0; t < v; t++)
      eccbuf[t] = 0;
    strinbuf = instring.slice(0);

    for (t = 0; t < width * width; t++)
      qrframe[t] = 0;

    for (t = 0; t < (width * (width + 1) + 1) / 2; t++)
      framask[t] = 0;

    // insert finders - black to frame, white to mask
    for (t = 0; t < 3; t++) {
      k = 0;
      y = 0;
      if (t == 1)
        k = (width - 7);
      if (t == 2)
        y = (width - 7);
      qrframe[(y + 3) + width * (k + 3)] = 1;
      for (x = 0; x < 6; x++) {
        qrframe[(y + x) + width * k] = 1;
        qrframe[y + width * (k + x + 1)] = 1;
        qrframe[(y + 6) + width * (k + x)] = 1;
        qrframe[(y + x + 1) + width * (k + 6)] = 1;
      }
      for (x = 1; x < 5; x++) {
        setmask(y + x, k + 1);
        setmask(y + 1, k + x + 1);
        setmask(y + 5, k + x);
        setmask(y + x + 1, k + 5);
      }
      for (x = 2; x < 4; x++) {
        qrframe[(y + x) + width * (k + 2)] = 1;
        qrframe[(y + 2) + width * (k + x + 1)] = 1;
        qrframe[(y + 4) + width * (k + x)] = 1;
        qrframe[(y + x + 1) + width * (k + 4)] = 1;
      }
    }

    // alignment blocks
    if (version > 1) {
      t = adelta[version];
      y = width - 7;
      for (; ;) {
        x = width - 7;
        while (x > t - 3) {
          putalign(x, y);
          if (x < t)
            break;
          x -= t;
        }
        if (y <= t + 9)
          break;
        y -= t;
        putalign(6, y);
        putalign(y, 6);
      }
    }

    // single black
    qrframe[8 + width * (width - 8)] = 1;

    // timing gap - mask only
    for (y = 0; y < 7; y++) {
      setmask(7, y);
      setmask(width - 8, y);
      setmask(7, y + width - 7);
    }
    for (x = 0; x < 8; x++) {
      setmask(x, 7);
      setmask(x + width - 8, 7);
      setmask(x, width - 8);
    }

    // reserve mask-format area
    for (x = 0; x < 9; x++)
      setmask(x, 8);
    for (x = 0; x < 8; x++) {
      setmask(x + width - 8, 8);
      setmask(8, x);
    }
    for (y = 0; y < 7; y++)
      setmask(8, y + width - 7);

    // timing row/col
    for (x = 0; x < width - 14; x++)
      if (x & 1) {
        setmask(8 + x, 6);
        setmask(6, 8 + x);
      }
      else {
        qrframe[(8 + x) + width * 6] = 1;
        qrframe[6 + width * (8 + x)] = 1;
      }

    // version block
    if (version > 6) {
      t = vpat[version - 7];
      k = 17;
      for (x = 0; x < 6; x++)
        for (y = 0; y < 3; y++ , k--)
          if (1 & (k > 11 ? version >> (k - 12) : t >> k)) {
            qrframe[(5 - x) + width * (2 - y + width - 11)] = 1;
            qrframe[(2 - y + width - 11) + width * (5 - x)] = 1;
          }
          else {
            setmask(5 - x, 2 - y + width - 11);
            setmask(2 - y + width - 11, 5 - x);
          }
    }

    // sync mask bits - only set above for white spaces, so add in black bits
    for (y = 0; y < width; y++)
      for (x = 0; x <= y; x++)
        if (qrframe[x + width * y])
          setmask(x, y);

    // convert string to bitstream
    // 8 bit data to QR-coded 8 bit data (numeric or alphanum, or kanji not supported)
    v = strinbuf.length;

    // string to array
    for (i = 0; i < v; i++)
      eccbuf[i] = strinbuf.charCodeAt(i);
    strinbuf = eccbuf.slice(0);

    // calculate max string length
    x = datablkw * (neccblk1 + neccblk2) + neccblk2;
    if (v >= x - 2) {
      v = x - 2;
      if (version > 9)
        v--;
    }

    // shift and repack to insert length prefix
    i = v;
    if (version > 9) {
      strinbuf[i + 2] = 0;
      strinbuf[i + 3] = 0;
      while (i--) {
        t = strinbuf[i];
        strinbuf[i + 3] |= 255 & (t << 4);
        strinbuf[i + 2] = t >> 4;
      }
      strinbuf[2] |= 255 & (v << 4);
      strinbuf[1] = v >> 4;
      strinbuf[0] = 0x40 | (v >> 12);
    }
    else {
      strinbuf[i + 1] = 0;
      strinbuf[i + 2] = 0;
      while (i--) {
        t = strinbuf[i];
        strinbuf[i + 2] |= 255 & (t << 4);
        strinbuf[i + 1] = t >> 4;
      }
      strinbuf[1] |= 255 & (v << 4);
      strinbuf[0] = 0x40 | (v >> 4);
    }
    // fill to end with pad pattern
    i = v + 3 - (version < 10);
    while (i < x) {
      strinbuf[i++] = 0xec;
      // buffer has room    if (i == x)      break;
      strinbuf[i++] = 0x11;
    }

    // calculate and append ECC

    // calculate generator polynomial
    genpoly[0] = 1;
    for (i = 0; i < eccblkwid; i++) {
      genpoly[i + 1] = 1;
      for (j = i; j > 0; j--)
        genpoly[j] = genpoly[j]
          ? genpoly[j - 1] ^ gexp[modnn(glog[genpoly[j]] + i)] : genpoly[j - 1];
      genpoly[0] = gexp[modnn(glog[genpoly[0]] + i)];
    }
    for (i = 0; i <= eccblkwid; i++)
      genpoly[i] = glog[genpoly[i]]; // use logs for genpoly[] to save calc step

    // append ecc to data buffer
    k = x;
    y = 0;
    for (i = 0; i < neccblk1; i++) {
      appendrs(y, datablkw, k, eccblkwid);
      y += datablkw;
      k += eccblkwid;
    }
    for (i = 0; i < neccblk2; i++) {
      appendrs(y, datablkw + 1, k, eccblkwid);
      y += datablkw + 1;
      k += eccblkwid;
    }
    // interleave blocks
    y = 0;
    for (i = 0; i < datablkw; i++) {
      for (j = 0; j < neccblk1; j++)
        eccbuf[y++] = strinbuf[i + j * datablkw];
      for (j = 0; j < neccblk2; j++)
        eccbuf[y++] = strinbuf[(neccblk1 * datablkw) + i + (j * (datablkw + 1))];
    }
    for (j = 0; j < neccblk2; j++)
      eccbuf[y++] = strinbuf[(neccblk1 * datablkw) + i + (j * (datablkw + 1))];
    for (i = 0; i < eccblkwid; i++)
      for (j = 0; j < neccblk1 + neccblk2; j++)
        eccbuf[y++] = strinbuf[x + i + j * eccblkwid];
    strinbuf = eccbuf;

    // pack bits into frame avoiding masked area.
    x = y = width - 1;
    k = v = 1;         // up, minus
    /* inteleaved data and ecc codes */
    m = (datablkw + eccblkwid) * (neccblk1 + neccblk2) + neccblk2;
    for (i = 0; i < m; i++) {
      t = strinbuf[i];
      for (j = 0; j < 8; j++ , t <<= 1) {
        if (0x80 & t)
          qrframe[x + width * y] = 1;
        do {        // find next fill position
          if (v)
            x--;
          else {
            x++;
            if (k) {
              if (y != 0)
                y--;
              else {
                x -= 2;
                k = !k;
                if (x == 6) {
                  x--;
                  y = 9;
                }
              }
            }
            else {
              if (y != width - 1)
                y++;
              else {
                x -= 2;
                k = !k;
                if (x == 6) {
                  x--;
                  y -= 8;
                }
              }
            }
          }
          v = !v;
        } while (ismasked(x, y));
      }
    }

    // save pre-mask copy of frame
    strinbuf = qrframe.slice(0);
    t = 0;           // best
    y = 30000;         // demerit
    // for instead of while since in original arduino code
    // if an early mask was "good enough" it wouldn't try for a better one
    // since they get more complex and take longer.
    for (k = 0; k < 8; k++) {
      applymask(k);      // returns black-white imbalance
      x = badcheck();
      if (x < y) { // current mask better than previous best?
        y = x;
        t = k;
      }
      if (t == 7)
        break;       // don't increment i to a void redoing mask
      qrframe = strinbuf.slice(0); // reset for next pass
    }
    if (t != k)         // redo best mask - none good enough, last wasn't t
      applymask(t);

    // add in final mask/ecclevel bytes
    y = fmtword[t + ((ecclevel - 1) << 3)];
    // low byte
    for (k = 0; k < 8; k++ , y >>= 1)
      if (y & 1) {
        qrframe[(width - 1 - k) + width * 8] = 1;
        if (k < 6)
          qrframe[8 + width * k] = 1;
        else
          qrframe[8 + width * (k + 1)] = 1;
      }
    // high byte
    for (k = 0; k < 7; k++ , y >>= 1)
      if (y & 1) {
        qrframe[8 + width * (width - 7 + k)] = 1;
        if (k)
          qrframe[(6 - k) + width * 8] = 1;
        else
          qrframe[7 + width * 8] = 1;
      }
    return qrframe;
  }

  var drawImg = function (src, width,ctx) {
    var imgSize = width / 5;
    var imgPos = width / 10 * 4;
    var imgPosFix = width / 120;
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 5;
    ctx.globalAlpha = 1;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    ctx.beginPath();
    ctx.moveTo(imgPos - imgPosFix, imgPos - imgPosFix);
    
    // 绘制layer
    ctx.lineTo(imgPos + imgSize + imgPosFix, imgPos - imgPosFix);
    ctx.lineTo(imgPos + imgSize + imgPosFix, imgPos + imgSize + imgPosFix);
    ctx.lineTo(imgPos - imgPosFix, imgPos + imgSize + imgPosFix);
    ctx.lineTo(imgPos - imgPosFix, imgPos - imgPosFix);
    
    ctx.stroke();
    ctx.closePath();

    ctx.drawImage(src, imgPos, imgPos, imgSize, imgSize);
    ctx.beginPath();
  }


  var _canvas = null;

  var api = {

    get ecclevel() {
      return ecclevel;
    },

    set ecclevel(val) {
      ecclevel = val;
    },

    get size() {
      return _size;
    },

    set size(val) {
      _size = val
    },

    get canvas() {
      return _canvas;
    },

    set canvas(el) {
      _canvas = el;
    },

    getFrame: function (string) {
      return genframe(string);
    },
    //这里的utf16to8(str)是对Text中的字符串进行转码，让其支持中文
    utf16to8: function (str) {
      var out, i, len, c;

      out = "";
      len = str.length;
      for (i = 0; i < len; i++) {
        c = str.charCodeAt(i);
        if ((c >= 0x0001) && (c <= 0x007F)) {
          out += str.charAt(i);
        } else if (c > 0x07FF) {
          out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
          out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F));
          out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
        } else {
          out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F));
          out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
        }
      }
      return out;
    },

    ///绘制二维码
    draw: function (str, canvas, cavW, cavH, ecc, src) {
      if (!src) {
        src = 'data:image/png;base64,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'.replace(/[\r\n]/g,"");
      }
      ecclevel = ecc || ecclevel;
      canvas = canvas || _canvas;
      if (!canvas) {
        console.warn('No canvas provided to draw QR code in!')
        return;
      }
      var size = Math.min(cavW, cavH);
      str = this.utf16to8(str);//增加中文显示
      //console.log(str)
      var frame = this.getFrame(str),
        ctx = wx.createCanvasContext(canvas),
        px = Math.round(size / (width + 8));
      var roundedSize = px * (width + 8),
        offset = Math.floor((size - roundedSize) / 2);
      size = roundedSize;
      ctx.clearRect(0, 0, cavW, cavW);
      ctx.setFillStyle('#000000');
      for (var i = 0; i < width; i++) {
        for (var j = 0; j < width; j++) {
          if (frame[j * width + i]) {
            ctx.fillRect(px * (4 + i) + offset, px * (4 + j) + offset, px, px);
          }
        }
      }
      drawImg(src, cavW,ctx);
      ctx.draw();
    }
  }
  module.exports = {
    qrApi: api
  }

})();