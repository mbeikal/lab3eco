/**
 * Розраховує ризики для здоров'я згідно з методикою МОЗ.
 * @param {Object} data
 */
const calculateHealthRisk = (data) => {
  const { C, IR, EF, ED, BW, AT, RfD, SF } = data;

  if (C < 0) throw new Error("Концентрація (C) не може бути від'ємною");
  if (IR <= 0) throw new Error("Швидкість споживання (IR) має бути більше 0");
  if (BW <= 0) throw new Error("Маса тіла (BW) має бути більше 0");
  if (AT <= 0) throw new Error("Період усереднення (AT) має бути більше 0");

  const numerator = C * IR * EF * ED;
  const denominator = BW * AT;
  const CDI = numerator / denominator;

  const HQ = RfD > 0 ? CDI / RfD : null;

  const CR = CDI * SF;

  return { CDI, HQ, CR };
};

module.exports = calculateHealthRisk;
