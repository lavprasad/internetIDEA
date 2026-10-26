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
        { skill: "fraction-percent", name: "Common fractions", body: "1/2 = 50%, 1/3 ≈ 33.33%, 1/4 = 25%, 1/5 = 20%, 1/8 = 12.5%, 3/8 = 37.5%." },
        { skill: "of-swap", name: "Swap trick", body: "x% of y equals y% of x. 20% of 80 and 80% of 20 are both 16." },
        { skill: "successive", name: "Successive change", body: "Up a% then down b% multiplies by (1 + a/100)(1 − b/100). Same r both ways: net change = −r²/100 %." },
        { skill: "reverse-percent", name: "Find the original", body: "If a number becomes N after a rise of r%, original = N / (1 + r/100)." },
        { skill: "compare", name: "More is not the same as less", body: "If A is 25% more than B, set B to 100 and A to 125. B is 25 short of 125, which is 20%, not 25%." }
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
        { skill: "gain-sp", name: "Price from a percent", body: "Gain of 20% means multiply CP by 1.20. Loss of 10% means divide SP by 0.90 to get CP." },
        { skill: "discount", name: "Discount on the tag", body: "15% off ₹800 is 0.85 × 800 = ₹680. Never take the percent off the cost unless the question says so." },
        { skill: "markup", name: "Mark up, then discount", body: "Up 25% then 20% off: ×1.25 × 0.80 = ×1.00. The tag looks generous and the sale is flat." },
        { skill: "false-weight", name: "Short weight", body: "Selling 900 g as 1 kg at cost gains 100 g on 900 g, which is 11.11%." },
        { skill: "same-sp", name: "Same selling price", body: "Two sales at the same price, +r% and −r%, lose r²/100 percent overall. 20 and 20 lose 4%." }
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
        { skill: "si", name: "The rectangle", body: "Principal × rate × years, then cut two zeros. 2500 × 8 × 3 / 100 = 600." },
        { skill: "ci", name: "Two-year compound", body: "10% for 2 years is ×1.1 × 1.1 = ×1.21. On ₹5000 the interest is ₹1050, not ₹1000." },
        { skill: "ci-si", name: "The gap", body: "The 2-year gap is interest on the first year's interest: P × (R/100)². At 5% on ₹4000 that gap is ₹10." },
        { skill: "double", name: "Doubling at simple interest", body: "To double, you need 100% interest. Rate × years = 100. In 8 years the rate is 12.5%." },
        { skill: "half-year", name: "Half-yearly compounding", body: "Halve the rate and double the number of periods. 20% for 1 year, half-yearly, is two steps of 10%: ×1.21." }
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
        { skill: "dst", name: "45 minutes is 3/4", body: "72 km/h for 45 minutes is 72 × 3/4 = 54 km. Convert minutes before multiplying." },
        { skill: "convert", name: "54 km/h", body: "54 × 5/18 = 15 m/s. A train at 54 km/h covers 15 metres each second." },
        { skill: "average-speed", name: "Harmonic average", body: "Same road both ways at 30 and 60 averages 40, not 45. The slow leg takes longer, so it counts more." },
        { skill: "train", name: "Passing a pole", body: "A pole is a point. Time = train length / speed. 150 m at 60 km/h (50/3 m/s) takes 9 seconds." },
        { skill: "boats", name: "Boat and stream", body: "Boat = (down + up) / 2. Stream = (down − up) / 2. Down 16 and up 10 means boat 13, stream 3." },
        { skill: "meet", name: "Closing the gap", body: "Relative speed is the sum when they face each other. 180 km at 40 + 50 closes in 2 hours." }
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
        { skill: "together", name: "Two workers", body: "A in a days, B in b days: together ab/(a+b). 12 and 18 give 36/5 = 7.2 days." },
        { skill: "one-left", name: "Find the missing worker", body: "If A + B is 6 days and A is 10, B's rate is 1/6 − 1/10 = 1/15. B needs 15 days." },
        { skill: "pipes", name: "A pipe and a leak", body: "Fill in a, empty in b, b > a: time = ab/(b − a). 4 and 6 give 12 hours." },
        { skill: "men-days", name: "More hands, fewer days", body: "Men × days stays constant. 15 men × 20 days = 10 men × 30 days." },
        { skill: "efficiency", name: "Percent more efficient", body: "50% more efficient is a rate ratio 3:2, so times are 2:3. If B needs 15 days, A needs 10." },
        { skill: "partial", name: "Someone starts, someone finishes", body: "Subtract the fraction already done. 6 of 24 days is 1/4. The remaining 3/4 in 9 days means a full job in 12 days." }
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
        { skill: "plain-avg", name: "Add, then divide", body: "18, 22, 26, 30 sit evenly around 24. Sum 96, count 4, average 24." },
        { skill: "remove", name: "Remove one value", body: "8 numbers average 15, sum 120. Seven average 14, sum 98. The one removed is 22." },
        { skill: "join", name: "Someone joins the group", body: "19 students average 15. With the teacher, 20 people average 16. Teacher = 320 − 285 = 35." },
        { skill: "alligation", name: "Alligation cross", body: "Cheaper 60, dearer 90, mean 70. Ratio cheaper:dearer = (90−70):(70−60) = 2:1." },
        { skill: "innings", name: "The next score", body: "10 innings average 46, sum 460. After 11, average 48, sum 528. The 11th innings is 68." },
        { skill: "weighted", name: "Weighted mean", body: "4 kg at 25 and 6 kg at 40. Total value 340, total weight 10, mean 34." }
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
        { skill: "div9", name: "Digit sum for 9", body: "Add the digits. If that sum is a multiple of 9, so is the number. 4626 → 18 → yes." },
        { skill: "unit", name: "Unit-digit cycles", body: "2^n cycles 2, 4, 8, 6. The 15th power sits at position 3 of that cycle, so the unit digit is 8." },
        { skill: "lcm", name: "LCM from primes", body: "8 = 2³, 12 = 2²×3, 18 = 2×3². LCM = 2³×3² = 72." },
        { skill: "hcf", name: "HCF from primes", body: "84 = 2²×3×7 and 126 = 2×3²×7. Shared is 2×3×7 = 42." },
        { skill: "remainder", name: "Same remainder", body: "Remainder 3 for 4, 5, and 6 means LCM(4,5,6) + 3 = 63." },
        { skill: "square", name: "Square near a ten", body: "(30+5)² = 30² + 2×30×5 + 5² = 900 + 300 + 25 = 1225." }
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
        { skill: "product", name: "n × (n+1)", body: "2, 6, 12, 20, 30 are 1×2, 2×3, 3×4, 4×5, 5×6. Next is 6×7 = 42." },
        { skill: "times", name: "Multiply by a constant", body: "4, 12, 36, 108 each multiply by 3. Next is 324." },
        { skill: "cubes", name: "Cubes in a line", body: "1, 8, 27, 64 are 1³ through 4³. Next is 5³ = 125." },
        { skill: "second-diff", name: "Jumps that grow", body: "6, 11, 21, 36, 56 jump by 5, 10, 15, 20. Next jump is 25, so 81." },
        { skill: "alternate", name: "Two-step dance", body: "×2, then −4, and repeat. From 40 the next step is −4, so 36." },
        { skill: "odd-one", name: "The odd one out", body: "8, 27, 64, 125 are cubes. 100 is only a square. The stranger is 100." }
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
    q("e6", "series", "odd-one", "Which number does not belong: 8, 27, 64, 100, 125?", ["8", "27", "64", "100"], "100", ["8, 27, 64 and 125 are cubes.", "100 is not a cube."])
  ];

  function q(id, chapter, skill, prompt, choices, answer, steps) {
    return { id: id, chapter: chapter, skill: skill, prompt: prompt, choices: choices, answer: answer, steps: steps };
  }

  window.AptitudeCourse = { chapters: chapters, questions: questions };
})();
