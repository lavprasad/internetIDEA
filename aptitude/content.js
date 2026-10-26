(function () {
  var chapters = [
    {
      id: "percent",
      title: "Percentages",
      blurb: "The base of profit, interest, and data questions.",
      idea: "Percent means out of 100. 20% is the fraction 20/100, which is 1/5.",
      notes: [
        "x% of y = (x / 100) × y.",
        "To undo a percent increase, divide by (1 + r), do not subtract the same percent.",
        "A rise of r% then a fall of r% always leaves you short by r²/100 percent."
      ],
      tricks: [
        { skill: "fraction-percent", name: "Fraction table", body: "Always: 1/2=50, 1/3=33⅓, 1/4=25, 1/5=20, 1/6=16⅔, 1/8=12.5, 3/8=37.5. These are definitions, so they do not depend on the question." },
        { skill: "of-swap", name: "Swap", body: "Always: x% of y = y% of x. It is the same multiplication, x×y/100, written two ways." },
        { skill: "successive", name: "Successive change", body: "Always: a% then b% is a net change of a + b + ab/100. Write a fall as a negative number. The same r up and down is −r²/100 %, never zero." },
        { skill: "reverse-percent", name: "Undo a percent", body: "Always: after a rise of r%, original = new ÷ (1 + r/100). After a fall, divide by (1 − r/100). Subtracting r% does not undo it." },
        { skill: "compare", name: "More versus less", body: "Always: if A is x% more than B, then B is 100x/(100+x) % less than A. 25% more means 20% less the other way, because the base changed." }
      ],
      memory: "A ₹100 shirt goes up 10% to ₹110, then down 10% of 110, which is ₹11. It ends at ₹99, not ₹100. The missing ₹1 is 1%."
    },
    {
      id: "ratio",
      title: "Ratio and proportion",
      blurb: "Split amounts, compare ages, and share profit.",
      idea: "A ratio a:b means the parts a and b of a whole a + b.",
      notes: [
        "Share of a = total × a / (a + b).",
        "To join a:b and b:c, scale until the two b's match.",
        "Mean proportional of a and b is √(ab). If a:x = x:b, then x² = ab."
      ],
      tricks: [
        { skill: "split", name: "Parts of a whole", body: "Add the parts first. 2:3:4 has 9 parts. Each part is total/9." },
        { skill: "chain", name: "Chain two ratios", body: "a:b = 2:3 and b:c = 4:5. Make b 12. Then a:b:c = 8:12:15, so a:c = 8:15." },
        { skill: "mean", name: "Mean proportional", body: "If a:x = x:b, then x² = ab. Between 9 and 16, x² = 144, so x = 12." },
        { skill: "ages", name: "Ages from a ratio", body: "If ages are 5:2 and the sum is 56, one part is 56/7 = 8. The son is 2 parts, 16." },
        { skill: "partnership", name: "Partnership", body: "Profit follows capital × months. 4000 for 6 months and 3000 for 8 months are equal shares." }
      ],
      memory: "Two people put in different money for different months. Write each as a rectangle: width is money, height is time. The areas are the shares."
    },
    {
      id: "profit",
      title: "Profit, loss, discount",
      blurb: "Cost price, marked price, and the discount that follows.",
      idea: "Profit and loss are always measured on cost price. Discount is always measured on marked price.",
      notes: [
        "SP = CP × (100 ± profit or loss%) / 100.",
        "To recover CP from SP, divide: CP = SP / (1 ± r).",
        "A markup and a discount multiply. They do not subtract."
      ],
      tricks: [
        { skill: "gain-sp", name: "Percent on cost", body: "Always: profit and loss percents use cost price. SP = CP × (100 ± r) / 100. To recover cost, divide, do not subtract." },
        { skill: "discount", name: "Percent on the tag", body: "Always: discount percent uses marked price, never cost, unless the question says otherwise. SP = MP × (100 − d) / 100." },
        { skill: "markup", name: "Markup then discount", body: "Always: multiply the factors. Up m% then discount d% is ×(1+m/100)×(1−d/100). Two discounts a% and b% equal one discount of a+b−ab/100." },
        { skill: "false-weight", name: "Short weight", body: "Always, when the sale is at cost price: profit% = (true weight − false weight) / false weight × 100." },
        { skill: "same-sp", name: "Same selling price", body: "Always: one gain of r% and one loss of r% at the same selling price is a loss of r²/100 % on the two together." }
      ],
      memory: "Think of the shop tag as a second number. Cost is the floor. The tag is painted above it. The discount cuts the tag, not the floor."
    },
    {
      id: "interest",
      title: "Simple and compound interest",
      blurb: "Straight growth versus growth on the growth.",
      idea: "Simple interest adds the same slice every year. Compound interest adds a slice of the new total.",
      notes: [
        "SI = P × R × T / 100.",
        "Amount at compound interest, yearly: P × (1 + R/100)^T.",
        "For 2 years, CI − SI = P × (R/100)²."
      ],
      tricks: [
        { skill: "si", name: "Simple interest", body: "Always: SI = P × R × T / 100. The slice is the same every year, so the amount is a straight line." },
        { skill: "ci", name: "Compound amount", body: "Always, for yearly compounding: amount = P × (1 + R/100)^T. Interest is amount minus principal." },
        { skill: "ci-si", name: "Two-year gap", body: "Always, for two yearly compounds: CI − SI = P × (R/100)². For three years multiply that gap by (3 + R/100)." },
        { skill: "double", name: "Doubling", body: "Always at simple interest: the sum doubles when R × T = 100. It triples when R × T = 200." },
        { skill: "half-year", name: "Half-yearly", body: "Always when interest is compounded half-yearly: use R/2 as the rate and 2T as the number of steps." }
      ],
      memory: "Simple interest is a stack of equal coins. Compound interest is a stack where each new coin is a photo of the whole stack so far."
    },
    {
      id: "speed",
      title: "Speed and distance",
      blurb: "Trains, meetings, and the trap of average speed.",
      idea: "Distance = speed × time. Keep the units in one family before you multiply.",
      notes: [
        "km/h to m/s: multiply by 5/18. m/s to km/h: multiply by 18/5.",
        "Equal distances at two speeds average to 2ab/(a+b), not (a+b)/2.",
        "Towards each other, add speeds. Same direction, subtract them."
      ],
      tricks: [
        { skill: "dst", name: "Distance", body: "Always: distance = speed × time, after the units match. 45 minutes is 3/4 of an hour, not 45." },
        { skill: "convert", name: "km/h and m/s", body: "Always: km/h × 5/18 = m/s, and m/s × 18/5 = km/h. 54 km/h is 15 m/s." },
        { skill: "average-speed", name: "Equal distance", body: "Always when the two distances are equal: average speed = 2ab/(a+b). The ordinary mean (a+b)/2 is for equal times, not equal roads." },
        { skill: "train", name: "Passing a pole or a platform", body: "Always: a pole uses the train's own length. A platform or another train adds that length too. Time = distance ÷ speed in m/s." },
        { skill: "boats", name: "Boat and stream", body: "Always: boat = (downstream + upstream) / 2, stream = (downstream − upstream) / 2." },
        { skill: "meet", name: "Relative speed", body: "Always: towards each other, add the speeds. Same direction, subtract them. Time = gap ÷ relative speed." }
      ],
      memory: "Average speed hides in the clock, not the speedometer. The hour you crawl counts as much as the hour you fly."
    },
    {
      id: "work",
      title: "Time and work",
      blurb: "People, pipes, and how rates add.",
      idea: "Give the whole job size 1. A person who finishes in n days works at 1/n per day.",
      notes: [
        "Together, add the daily rates, then flip.",
        "A leak is a negative rate. Net rate = fill − empty.",
        "People and days move in opposite directions when the job stays the same."
      ],
      tricks: [
        { skill: "together", name: "Two workers", body: "Always: rates add. A in a days and B in b days finish together in ab/(a+b) days." },
        { skill: "one-left", name: "Missing rate", body: "Always: the missing rate is the difference of the known rates. 1/together − 1/A = 1/B." },
        { skill: "pipes", name: "Tap and leak", body: "Always: a leak is a negative rate. If the tap fills in a and the leak empties in b, with b > a, the tank fills in ab/(b−a)." },
        { skill: "men-days", name: "Hands and days", body: "Always, for the same job and the same hours per day: men × days stays constant." },
        { skill: "efficiency", name: "Efficiency and time", body: "Always: time is the reverse of efficiency. 50% more efficient is the ratio 3:2, so the times are 2:3." },
        { skill: "partial", name: "Part of the job", body: "Always: fraction done = days worked / days needed alone. What is left is 1 minus that fraction." }
      ],
      memory: "A tank has a tap pouring in and a hole pouring out. Draw both arrows. The water moves at the difference."
    },
    {
      id: "average",
      title: "Averages and mixtures",
      blurb: "The mean, and how a new value pulls it.",
      idea: "Average × count = sum. Most average questions are sum questions in a coat.",
      notes: [
        "New item: new sum = old average × old count ± the change.",
        "Alligation: the ratio of two ingredients is the distance each price sits from the mean, crossed.",
        "A heavier quantity pulls the mean closer to itself."
      ],
      tricks: [
        { skill: "plain-avg", name: "Sum", body: "Always: sum = average × count. Change the sum first, then divide again." },
        { skill: "remove", name: "One value leaves", body: "Always: removed value = old sum − new sum. New sum = new average × new count." },
        { skill: "join", name: "One value joins", body: "Always: the newcomer = new sum − old sum. Both sums are average × count." },
        { skill: "alligation", name: "Alligation", body: "Always, when the mean sits strictly between the two prices: cheaper:dearer = (dearer − mean):(mean − cheaper)." },
        { skill: "innings", name: "The next score", body: "Always: the next score = new sum − old sum. If the average of n rises by x, the new item is old item + n×x." },
        { skill: "weighted", name: "Weighted mean", body: "Always: mean = (value × weight, added up) / (weights added up)." }
      ],
      memory: "The mean is the balance point of a seesaw. A price far from the middle needs less weight to balance one that sits close."
    },
    {
      id: "numbers",
      title: "Number sense",
      blurb: "Divisibility, last digits, and LCM without long division.",
      idea: "You rarely need the whole number. You need a digit, a remainder, or a common multiple.",
      notes: [
        "A number is a sum of its place values. Rules watch that sum, or the last digits.",
        "Unit digits repeat in short cycles. Powers only need the position in the cycle.",
        "LCM takes the highest power of each prime. HCF takes the lowest."
      ],
      tricks: [
        { skill: "div9", name: "Digit sum", body: "Always: a number is divisible by 9 exactly when its digit sum is. The same test with 3 uses a digit sum divisible by 3." },
        { skill: "unit", name: "Unit-digit cycle", body: "Always for whole-number powers: the unit digit repeats. 2 goes 2,4,8,6. Position is the exponent mod 4, and a remainder of 0 means the 4th digit." },
        { skill: "lcm", name: "LCM", body: "Always: take the highest power of every prime that appears. That product is the least common multiple." },
        { skill: "hcf", name: "HCF", body: "Always: take the lowest power of every prime that appears in both. That product is the highest common factor." },
        { skill: "remainder", name: "Same remainder", body: "Always: if the remainder is the same for several divisors, the number is (LCM of the divisors) × k + remainder." },
        { skill: "square", name: "Square ending in 5", body: "Always for a number 10a+5: the square is a×(a+1), then the digits 25. 35² → 3×4 = 12, so 1225. The identity (a+b)² = a²+2ab+b² holds for every a and b." }
      ],
      memory: "The last digit of powers of 2 drums 2-4-8-6 and then repeats, like a four-beat loop."
    },
    {
      id: "chance",
      title: "Probability",
      blurb: "Count the outcomes you want, then count all of them.",
      idea: "Probability = favourable / total, when every outcome is equally likely.",
      notes: [
        "A coin has 2 outcomes. Two coins have 4. A die has 6. Two dice have 36.",
        "P(not A) = 1 − P(A).",
        "Independent events: multiply the probabilities."
      ],
      tricks: [
        { skill: "coins", name: "List the coins", body: "HH, HT, TH, TT. Both heads is 1 of 4." },
        { skill: "die", name: "Count faces", body: "Greater than 4 on a die is {5, 6}, so 2/6 = 1/3." },
        { skill: "bag", name: "Not the colour", body: "4 red and 6 blue. Not red is 6/10 = 3/5. You can also do 1 − 4/10." },
        { skill: "dice-sum", name: "The 6 by 6 table", body: "Sum 9 happens in 4 ways: (3,6), (4,5), (5,4), (6,3). That is 4/36 = 1/9." },
        { skill: "cards", name: "A deck of 52", body: "4 kings in 52 cards is 1/13. Four suits do not change that count." },
        { skill: "both", name: "Both happen", body: "Independent: multiply. 2/5 and 1/2 give 1/5." }
      ],
      memory: "Two dice are a 6 by 6 chessboard. Each square is one way the throw can land. Shade the squares you want and count them."
    },
    {
      id: "series",
      title: "Number series",
      blurb: "The pattern is usually a second list hiding under the first.",
      idea: "Write the jumps between terms before you guess the rule.",
      notes: [
        "Squares: 1, 4, 9, 16, 25, 36. Cubes: 1, 8, 27, 64, 125.",
        "If the jumps themselves jump by a constant, the next jump is fixed.",
        "Alternating series apply one rule, then another, then the first again."
      ],
      tricks: [
        { skill: "product", name: "Check every term", body: "No series shortcut fits every question. Always write the jumps and keep a rule only if it fits every given term. Here the terms are n(n+1)." },
        { skill: "times", name: "Constant multiplier", body: "Keep a ×k rule only after it fits every step you were given. Here each step is ×3." },
        { skill: "cubes", name: "Known lists", body: "Squares and cubes are worth knowing because they repeat: 1, 8, 27, 64, 125, 216. A list still has to match every term." },
        { skill: "second-diff", name: "Jumps of the jumps", body: "Always start with the first jumps. If those jumps themselves rise by a constant, the next jump is fixed. Confirm it on every term." },
        { skill: "alternate", name: "Two rules taking turns", body: "Use this only when odd steps follow one rule and even steps follow another, and both rules survive every term shown." },
        { skill: "odd-one", name: "The stranger", body: "The odd one out is the term that breaks the rule the others all share. Test the rule on every number, not just the last." }
      ],
      memory: "Do not stare at the terms. Stare at the gaps. If the gaps make a pattern you already know, the series is finished."
    }
  ];

  var questions = [
    q("p1", "percent", "fraction-percent", "What is 3/8 as a percent?", ["32%", "37.5%", "38%", "40%"], "37.5%", ["3/8 = 0.375.", "0.375 × 100 = 37.5%."]),
    q("p2", "percent", "of-swap", "What is 20% of 150?", ["25", "30", "35", "40"], "30", ["10% of 150 is 15.", "20% is twice that, 30."]),
    q("p3", "percent", "successive", "A price of 200 rises 10%, then falls 10%. What is the final price?", ["200", "198", "180", "220"], "198", ["200 × 1.10 = 220.", "220 × 0.90 = 198.", "Net change is −1%, which is −2."]),
    q("p4", "percent", "reverse-percent", "A number increased by 20% becomes 72. What was it?", ["52", "58", "60", "64"], "60", ["New = original × 1.20.", "Original = 72 / 1.20 = 60."]),
    q("p5", "percent", "compare", "A is 25% more than B. B is what percent less than A?", ["25%", "20%", "15%", "12.5%"], "20%", ["Let B = 100. Then A = 125.", "The gap is 25 on 125, which is 20%."]),
    q("p6", "percent", "fraction-percent", "45 is what percent of 180?", ["20%", "25%", "30%", "45%"], "25%", ["45/180 = 1/4.", "1/4 = 25%."]),

    q("r1", "ratio", "split", "450 is split in the ratio 2:3:4. What is the middle share?", ["100", "150", "200", "225"], "150", ["Parts: 2 + 3 + 4 = 9.", "One part = 50. Middle = 3 × 50 = 150."]),
    q("r2", "ratio", "chain", "a:b = 2:3 and b:c = 4:5. What is a:c?", ["8:15", "2:5", "6:15", "8:12"], "8:15", ["Scale b to 12.", "a:b:c = 8:12:15, so a:c = 8:15."]),
    q("r3", "ratio", "ages", "A father and son are aged in the ratio 5:2. Their ages sum to 56. How old is the son?", ["14", "16", "18", "20"], "16", ["7 parts = 56, so 1 part = 8.", "Son = 2 × 8 = 16."]),
    q("r4", "ratio", "partnership", "A invests 4000 for 6 months. B invests 3000 for 8 months. What is A's share of the profit to B's?", ["4:3", "1:1", "3:4", "2:1"], "1:1", ["A: 4000 × 6 = 24000.", "B: 3000 × 8 = 24000.", "The ratio is 1:1."]),
    q("r5", "ratio", "mean", "What is the mean proportional of 9 and 16?", ["12", "12.5", "15", "18"], "12", ["x² = 9 × 16 = 144.", "x = 12."]),
    q("r6", "ratio", "mean", "If 5:x = x:20, what is x?", ["8", "10", "12", "15"], "10", ["x² = 5 × 20 = 100.", "x = 10."]),

    q("f1", "profit", "gain-sp", "Cost price is 250. The gain is 20%. What is the selling price?", ["270", "280", "300", "320"], "300", ["20% of 250 is 50.", "SP = 250 + 50 = 300."]),
    q("f2", "profit", "gain-sp", "Selling price is 180 at a loss of 10%. What was the cost?", ["190", "198", "200", "220"], "200", ["SP is 90% of CP.", "CP = 180 / 0.90 = 200."]),
    q("f3", "profit", "discount", "Marked price is 800. The discount is 15%. What is the selling price?", ["650", "680", "700", "720"], "680", ["15% of 800 is 120.", "800 − 120 = 680."]),
    q("f4", "profit", "markup", "Cost is 400. It is marked 25% up, then discounted 20%. What is the profit percent?", ["0%", "5%", "5% loss", "10%"], "0%", ["Marked price = 400 × 1.25 = 500.", "Selling price = 500 × 0.80 = 400.", "Profit is 0."]),
    q("f5", "profit", "false-weight", "A seller uses a 900 g weight as 1 kg and sells at cost price. What is the profit percent?", ["9%", "10%", "11.11%", "12.5%"], "11.11%", ["The buyer pays for 1000 g and receives 900 g.", "Gain = 100/900 = 1/9 ≈ 11.11%."]),
    q("f6", "profit", "same-sp", "Two watches are each sold for 600. One gains 20%, the other loses 20%. What is the net result?", ["no gain or loss", "4% gain", "4% loss", "2% loss"], "4% loss", ["Costs are 500 and 750, total 1250.", "Selling total is 1200.", "Loss 50/1250 = 4%."]),

    q("i1", "interest", "si", "Simple interest on 2500 at 8% for 3 years is:", ["500", "600", "640", "800"], "600", ["2500 × 8 × 3 / 100.", "25 × 24 = 600."]),
    q("i2", "interest", "ci", "Compound interest on 5000 at 10% for 2 years, compounded yearly, is:", ["1000", "1050", "1100", "1210"], "1050", ["Amount = 5000 × 1.21 = 6050.", "Interest = 6050 − 5000 = 1050."]),
    q("i3", "interest", "ci-si", "On 4000 at 5% for 2 years, how much more is compound interest than simple interest?", ["8", "10", "20", "40"], "10", ["Gap = P × (R/100)².", "4000 × 0.05 × 0.05 = 10."]),
    q("i4", "interest", "si", "Simple interest of 720 is earned on 4000 in 3 years. What is the rate?", ["5%", "6%", "8%", "9%"], "6%", ["720 = 4000 × R × 3 / 100.", "R = 72000 / 12000 = 6."]),
    q("i5", "interest", "double", "A sum doubles in 8 years at simple interest. What is the yearly rate?", ["8%", "10%", "12.5%", "16%"], "12.5%", ["Doubling needs 100% interest.", "Rate = 100/8 = 12.5%."]),
    q("i6", "interest", "half-year", "10000 is lent at 20% compounded half-yearly for 1 year. What is the compound interest?", ["2000", "2100", "2200", "2400"], "2100", ["Two periods of 10%.", "Amount = 10000 × 1.21 = 12100.", "Interest = 2100."]),

    q("s1", "speed", "dst", "A car travels at 72 km/h for 45 minutes. How far does it go?", ["36 km", "48 km", "54 km", "60 km"], "54 km", ["45 minutes = 3/4 hour.", "72 × 3/4 = 54 km."]),
    q("s2", "speed", "convert", "54 km/h is how many metres per second?", ["12", "15", "18", "20"], "15", ["Multiply by 5/18.", "54 × 5 / 18 = 15."]),
    q("s3", "speed", "average-speed", "A road is covered at 30 km/h going and 60 km/h returning. What is the average speed?", ["40 km/h", "45 km/h", "48 km/h", "50 km/h"], "40 km/h", ["Equal distances: 2×30×60 / (30+60).", "3600/90 = 40."]),
    q("s4", "speed", "train", "A 150 m train runs at 60 km/h. How long does it take to pass a pole?", ["6 s", "8 s", "9 s", "12 s"], "9 s", ["60 km/h = 50/3 m/s.", "Time = 150 / (50/3) = 9 seconds."]),
    q("s5", "speed", "boats", "Downstream speed is 16 km/h and upstream is 10 km/h. What is the speed of the stream?", ["2 km/h", "3 km/h", "4 km/h", "6 km/h"], "3 km/h", ["Stream = (down − up) / 2.", "(16 − 10) / 2 = 3."]),
    q("s6", "speed", "meet", "Two towns are 180 km apart. Cyclists ride toward each other at 40 and 50 km/h. When do they meet?", ["1.5 h", "2 h", "2.5 h", "3 h"], "2 h", ["Closing speed = 90 km/h.", "180/90 = 2 hours."]),

    q("w1", "work", "together", "A finishes a job in 12 days, B in 18 days. How long do they take together?", ["6 days", "7.2 days", "8 days", "10 days"], "7.2 days", ["Together = 12×18 / (12+18).", "216/30 = 7.2 days."]),
    q("w2", "work", "one-left", "A and B together finish in 6 days. A alone finishes in 10 days. How long does B alone take?", ["12 days", "15 days", "16 days", "20 days"], "15 days", ["1/6 − 1/10 = 1/15.", "B takes 15 days."]),
    q("w3", "work", "pipes", "A pipe fills a tank in 4 hours. A leak empties it in 6 hours. With both open, how long to fill?", ["8 h", "10 h", "12 h", "24 h"], "12 h", ["Time = 4×6 / (6−4).", "24/2 = 12 hours."]),
    q("w4", "work", "men-days", "15 people finish a job in 20 days. How many days do 10 people need for the same job?", ["25", "30", "35", "40"], "30", ["15 × 20 = 10 × days.", "Days = 300/10 = 30."]),
    q("w5", "work", "efficiency", "A is 50% more efficient than B. B finishes in 15 days. How long does A take?", ["7.5 days", "10 days", "12 days", "22.5 days"], "10 days", ["Rates 3:2, so times 2:3.", "A = 15 × 2/3 = 10 days."]),
    q("w6", "work", "partial", "A can finish in 24 days and works for 6 days. B finishes the rest in 9 days. How long would B take alone?", ["9 days", "12 days", "15 days", "18 days"], "12 days", ["A did 6/24 = 1/4.", "B did 3/4 in 9 days, so a whole job takes 12 days."]),

    q("v1", "average", "plain-avg", "What is the average of 18, 22, 26 and 30?", ["22", "24", "26", "28"], "24", ["Sum = 96.", "96/4 = 24."]),
    q("v2", "average", "remove", "Eight numbers average 15. After one is removed, the average of the rest is 14. What was removed?", ["18", "20", "22", "24"], "22", ["Old sum = 120. New sum = 98.", "Removed = 22."]),
    q("v3", "average", "join", "19 students average 15 years. A teacher joins and the average becomes 16. How old is the teacher?", ["30", "35", "36", "40"], "35", ["New sum = 16 × 20 = 320.", "Old sum = 285. Teacher = 35."]),
    q("v4", "average", "alligation", "Tea at 60 and tea at 90 are mixed to make tea at 70. What is the ratio of cheaper to dearer?", ["1:2", "2:1", "3:1", "1:1"], "2:1", ["(90−70):(70−60) = 20:10.", "That is 2:1."]),
    q("v5", "average", "innings", "A batsman's average is 46 after 10 innings. After the 11th it is 48. What did he score in the 11th?", ["58", "64", "68", "70"], "68", ["Old sum = 460. New sum = 528.", "11th innings = 68."]),
    q("v6", "average", "weighted", "4 kg at 25 per kg is mixed with 6 kg at 40 per kg. What is the mean price per kg?", ["32", "34", "35", "36.5"], "34", ["Value = 100 + 240 = 340.", "340/10 = 34."]),

    q("n1", "numbers", "div9", "Which of these is divisible by 9?", ["4625", "4626", "4627", "4628"], "4626", ["4+6+2+6 = 18.", "18 is a multiple of 9."]),
    q("n2", "numbers", "unit", "What is the unit digit of 2^15?", ["2", "4", "6", "8"], "8", ["The cycle of 2 is 2, 4, 8, 6.", "15 mod 4 = 3, the third digit, 8."]),
    q("n3", "numbers", "lcm", "What is the LCM of 8, 12 and 18?", ["36", "48", "72", "144"], "72", ["Highest powers: 2³ and 3².", "8 × 9 = 72."]),
    q("n4", "numbers", "hcf", "What is the HCF of 84 and 126?", ["14", "21", "42", "63"], "42", ["84 = 2²×3×7. 126 = 2×3²×7.", "Shared: 2×3×7 = 42."]),
    q("n5", "numbers", "remainder", "What is the smallest number that leaves remainder 3 when divided by 4, 5 and 6?", ["60", "63", "66", "69"], "63", ["LCM of 4, 5 and 6 is 60.", "60 + 3 = 63."]),
    q("n6", "numbers", "square", "What is 35²?", ["1125", "1225", "1255", "1325"], "1225", ["(30+5)² = 900 + 300 + 25.", "1225."]),

    q("c1", "chance", "coins", "A fair coin is tossed twice. What is the probability of two heads?", ["1/2", "1/3", "1/4", "1/8"], "1/4", ["Outcomes: HH, HT, TH, TT.", "Only HH works, so 1/4."]),
    q("c2", "chance", "die", "A fair die is rolled. What is the probability of a number greater than 4?", ["1/6", "1/3", "1/2", "2/3"], "1/3", ["Faces 5 and 6.", "2/6 = 1/3."]),
    q("c3", "chance", "bag", "A bag has 4 red and 6 blue marbles. What is the probability of not drawing red?", ["2/5", "1/2", "3/5", "2/3"], "3/5", ["6 blue out of 10.", "6/10 = 3/5."]),
    q("c4", "chance", "dice-sum", "Two fair dice are rolled. What is the probability that the sum is 9?", ["1/12", "1/9", "1/6", "1/4"], "1/9", ["4 outcomes out of 36.", "4/36 = 1/9."]),
    q("c5", "chance", "cards", "One card is drawn from a 52-card deck. What is the probability it is a king?", ["1/52", "1/26", "1/13", "1/4"], "1/13", ["4 kings.", "4/52 = 1/13."]),
    q("c6", "chance", "both", "P(A) = 2/5 and P(B) = 1/2, and the events are independent. What is P(both)?", ["1/10", "1/5", "2/5", "9/10"], "1/5", ["Multiply independent probabilities.", "2/5 × 1/2 = 1/5."]),

    q("e1", "series", "product", "2, 6, 12, 20, 30, ?", ["36", "40", "42", "48"], "42", ["These are n(n+1): 1×2, 2×3, 3×4, 4×5, 5×6.", "Next is 6×7 = 42."]),
    q("e2", "series", "times", "4, 12, 36, 108, ?", ["216", "304", "324", "432"], "324", ["Each term is ×3.", "108 × 3 = 324."]),
    q("e3", "series", "cubes", "1, 8, 27, 64, ?", ["100", "125", "144", "216"], "125", ["1³, 2³, 3³, 4³.", "Next is 5³ = 125."]),
    q("e4", "series", "second-diff", "6, 11, 21, 36, 56, ?", ["71", "76", "81", "86"], "81", ["Jumps: 5, 10, 15, 20.", "Next jump is 25. 56 + 25 = 81."]),
    q("e5", "series", "alternate", "8, 16, 12, 24, 20, 40, ?", ["32", "36", "44", "48"], "36", ["The dance is ×2, then −4.", "40 − 4 = 36."]),
    q("e6", "series", "odd-one", "Which number does not belong: 8, 27, 64, 100, 125?", ["8", "27", "64", "100"], "100", ["8, 27, 64 and 125 are cubes.", "100 is not a cube."]),

    q("p7", "percent", "fraction-percent", "What is 1/6 as a percent, to two decimals?", ["15%", "16.67%", "18%", "20%"], "16.67%", ["1/6 = 0.1666…", "That is 16.67%."]),
    q("p8", "percent", "of-swap", "What is 15% of 80?", ["10", "12", "15", "18"], "12", ["10% of 80 is 8.", "5% is 4, so 15% is 12."]),
    q("p9", "percent", "successive", "A value rises 20% and then rises another 10%. What is the net percent increase?", ["30%", "32%", "22%", "28%"], "32%", ["20 + 10 + (20×10)/100 = 32.", "The extra 2 comes from 10% of the first rise."]),
    q("p10", "percent", "compare", "A is 20% less than B. B is what percent more than A?", ["20%", "25%", "16%", "30%"], "25%", ["Let B = 100. Then A = 80.", "The gap is 20 on 80, which is 25%."]),

    q("r7", "ratio", "split", "360 is split in the ratio 1:2:3. What is the middle share?", ["60", "120", "180", "90"], "120", ["1 + 2 + 3 = 6 parts.", "One part = 60. The middle share is 120."]),
    q("r8", "ratio", "chain", "a:b = 3:4 and b:c = 2:5. What is a:c?", ["3:10", "3:5", "6:5", "2:5"], "3:10", ["Keep b as 4. Then c = 10.", "a:c = 3:10."]),
    q("r9", "ratio", "ages", "Two ages are in the ratio 4:3 and sum to 42. What is the younger age?", ["16", "18", "21", "24"], "18", ["7 parts = 42, so one part is 6.", "The younger is 3 parts, 18."]),
    q("r10", "ratio", "partnership", "A invests 5000 for 4 months. B invests 2000 for 10 months. What is the profit ratio A:B?", ["5:2", "1:1", "2:5", "4:5"], "1:1", ["A: 5000 × 4 = 20000.", "B: 2000 × 10 = 20000."]),

    q("f7", "profit", "gain-sp", "Cost price is 80 and the gain is 25%. What is the selling price?", ["90", "100", "105", "120"], "100", ["25% of 80 is 20.", "Selling price = 100."]),
    q("f8", "profit", "markup", "A tag of 200 gets two successive discounts of 10% each. What is the selling price?", ["160", "162", "170", "180"], "162", ["10% then 10% is not 20%.", "200 × 0.9 × 0.9 = 162."]),
    q("f9", "profit", "false-weight", "A seller gives 800 g for a kilogram and charges the cost price. What is the profit percent?", ["20%", "25%", "16%", "30%"], "25%", ["Profit% = (1000 − 800) / 800 × 100.", "200/800 = 25%."]),
    q("f10", "profit", "same-sp", "Two items are sold at the same price. One gains 10% and the other loses 10%. What is the net result?", ["1% loss", "1% gain", "no change", "10% loss"], "1% loss", ["Same price with +r% and −r% loses r²/100 %.", "Here r = 10, so the loss is 1%."]),

    q("i7", "interest", "si", "Simple interest on 1500 at 12% for 2 years is:", ["300", "360", "380", "450"], "360", ["1500 × 12 × 2 / 100.", "15 × 24 = 360."]),
    q("i8", "interest", "ci", "Compound interest on 2000 at 10% for 2 years, compounded yearly, is:", ["400", "420", "440", "484"], "420", ["Amount factor for two years at 10% is 1.21.", "Interest = 2000 × 0.21 = 420."]),
    q("i9", "interest", "double", "A sum doubles in 5 years at simple interest. What is the yearly rate?", ["15%", "20%", "25%", "10%"], "20%", ["Doubling needs R × T = 100.", "R = 100/5 = 20%."]),
    q("i10", "interest", "ci-si", "For 10000 at 10% compounded yearly, how much more is the 2-year compound interest than the simple interest?", ["50", "100", "200", "210"], "100", ["Gap = P × (R/100)².", "10000 × 0.01 = 100."]),

    q("s7", "speed", "dst", "A bus runs at 40 km/h for 90 minutes. How far does it go?", ["40 km", "50 km", "60 km", "80 km"], "60 km", ["90 minutes = 1.5 hours.", "40 × 1.5 = 60 km."]),
    q("s8", "speed", "convert", "36 km/h is how many metres per second?", ["8", "10", "12", "15"], "10", ["36 × 5/18 = 10.", "The train covers 10 metres each second."]),
    q("s9", "speed", "average-speed", "Equal distances are covered at 20 km/h and 30 km/h. What is the average speed?", ["24 km/h", "25 km/h", "26 km/h", "28 km/h"], "24 km/h", ["2×20×30 / (20+30) = 1200/50.", "The average is 24 km/h."]),
    q("s10", "speed", "meet", "Two cyclists are 100 km apart and ride toward each other at 30 and 20 km/h. When do they meet?", ["1 h", "2 h", "2.5 h", "5 h"], "2 h", ["Closing speed = 50 km/h.", "100/50 = 2 hours."]),

    q("w7", "work", "together", "A finishes in 10 days and B in 15 days. How long do they take together?", ["5 days", "6 days", "8 days", "12 days"], "6 days", ["10×15 / (10+15) = 150/25.", "Together they take 6 days."]),
    q("w8", "work", "pipes", "A tap fills a tank in 3 hours. A leak empties it in 6 hours. With both open, how long to fill?", ["4 h", "5 h", "6 h", "9 h"], "6 h", ["Time = 3×6 / (6−3).", "18/3 = 6 hours."]),
    q("w9", "work", "men-days", "12 people finish a job in 15 days. How many days do 18 people need?", ["8", "10", "12", "20"], "10", ["12 × 15 = 18 × days.", "Days = 180/18 = 10."]),
    q("w10", "work", "efficiency", "A is twice as efficient as B. Together they finish in 8 days. How long does A take alone?", ["10 days", "12 days", "16 days", "24 days"], "12 days", ["Rates 2:1, so A does 2/3 of the daily work.", "2/3 of a job per 8 days means A alone needs 12 days."]),

    q("v7", "average", "plain-avg", "What is the average of 5, 10, 15 and 20?", ["10", "12.5", "15", "12"], "12.5", ["Sum = 50.", "50/4 = 12.5."]),
    q("v8", "average", "remove", "Five numbers average 20. After one is removed, the average of the rest is 18. What was removed?", ["22", "24", "26", "28"], "28", ["Old sum = 100. New sum = 72.", "Removed = 28."]),
    q("v9", "average", "alligation", "Prices 30 and 50 are mixed to a mean of 35. What is cheaper:dearer?", ["3:1", "1:3", "2:1", "5:1"], "3:1", ["(50−35):(35−30) = 15:5.", "That is 3:1."]),
    q("v10", "average", "weighted", "2 kg at 10 per kg is mixed with 3 kg at 20 per kg. What is the mean price?", ["14", "15", "16", "18"], "16", ["Value = 20 + 60 = 80.", "80/5 = 16."]),

    q("n7", "numbers", "div9", "Which of these is divisible by 9?", ["3815", "3816", "3817", "3818"], "3816", ["3+8+1+6 = 18.", "18 is a multiple of 9."]),
    q("n8", "numbers", "unit", "What is the unit digit of 7^4?", ["3", "7", "9", "1"], "1", ["Powers of 7 end in 7, 9, 3, 1 and then repeat.", "The 4th place in that loop is 1."]),
    q("n9", "numbers", "lcm", "What is the LCM of 6 and 8?", ["12", "16", "24", "48"], "24", ["6 = 2×3 and 8 = 2³.", "LCM = 2³×3 = 24."]),
    q("n10", "numbers", "square", "What is 75²?", ["5525", "5625", "5725", "4925"], "5625", ["75 = 10×7 + 5.", "7×8 = 56, then write 25: 5625."]),

    q("c7", "chance", "die", "A fair die is rolled. What is the probability of rolling a 1?", ["1/6", "1/3", "1/2", "1/4"], "1/6", ["One face out of six.", "The probability is 1/6."]),
    q("c8", "chance", "bag", "A bag has 5 red and 5 blue marbles. What is the probability of drawing red?", ["1/5", "2/5", "1/2", "3/5"], "1/2", ["5 red out of 10.", "5/10 = 1/2."]),
    q("c9", "chance", "dice-sum", "Two fair dice are rolled. What is the probability that the sum is 7?", ["1/12", "1/9", "1/6", "1/4"], "1/6", ["Six outcomes out of 36.", "6/36 = 1/6."]),
    q("c10", "chance", "cards", "One card is drawn from a 52-card deck. What is the probability it is an ace or a king?", ["1/13", "2/13", "1/26", "1/4"], "2/13", ["4 aces and 4 kings make 8 cards.", "8/52 = 2/13."]),

    q("e7", "series", "product", "3, 8, 15, 24, ?", ["30", "33", "35", "36"], "35", ["These are 1×3, 2×4, 3×5, 4×6.", "Next is 5×7 = 35."]),
    q("e8", "series", "times", "5, 10, 20, 40, ?", ["60", "70", "80", "100"], "80", ["Each term doubles.", "40 × 2 = 80."]),
    q("e9", "series", "cubes", "8, 27, 64, 125, ?", ["150", "196", "216", "250"], "216", ["These are 2³, 3³, 4³, 5³.", "Next is 6³ = 216."]),
    q("e10", "series", "second-diff", "2, 3, 6, 11, 18, ?", ["25", "27", "29", "31"], "27", ["Jumps: 1, 3, 5, 7.", "The next jump is 9, and 18 + 9 = 27."])
  ];

  function q(id, chapter, skill, prompt, choices, answer, steps) {
    return { id: id, chapter: chapter, skill: skill, prompt: prompt, choices: choices, answer: answer, steps: steps };
  }

  var always = [
    "x% of y = y% of x.",
    "a% then b% changes the value by a + b + ab/100. A fall is negative.",
    "If A is x% more than B, B is 100x/(100+x) % less than A.",
    "Profit and loss use cost price. Discount uses marked price.",
    "Same selling price, +r% and −r%, loses r²/100 % overall.",
    "Equal distances at speeds a and b average 2ab/(a+b). Equal times use (a+b)/2.",
    "km/h × 5/18 = m/s.",
    "Towards each other, add speeds. Same direction, subtract.",
    "Boat = (down + up) / 2. Stream = (down − up) / 2.",
    "Two people in a and b days finish together in ab/(a+b).",
    "A tap in a hours and a leak in b hours, b > a, fill the tank in ab/(b − a).",
    "Two-year CI − SI = P × (R/100)² when compounding is yearly.",
    "Cheaper : dearer = (dearer − mean) : (mean − cheaper), with the mean strictly between them.",
    "A number is divisible by 9 exactly when its digits add to a multiple of 9."
  ];

  var generated = (typeof window !== "undefined" && window.AptitudeBank) ? window.AptitudeBank.generate() : [];
  window.AptitudeCourse = { chapters: chapters, questions: questions.concat(generated), always: always };
})();
