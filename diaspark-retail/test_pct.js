const recalculatePercentages = (currentRows) => {
    const activeRows = currentRows.filter(r => r.name && r.name.trim() !== '');
    const numActive = activeRows.length;
    
    if (numActive === 0) {
      return currentRows.map(r => ({ ...r, pct: '0.00' }));
    }
    
    const splitPct = Math.floor(10000 / numActive) / 100;
    let remaining = 100;
    let activeSeen = 0;
    
    return currentRows.map((r) => {
      if (!r.name || r.name.trim() === '') {
        return { ...r, pct: '0.00' };
      }
      
      activeSeen++;
      if (activeSeen === numActive) {
        return { ...r, pct: remaining.toFixed(2) };
      } else {
        remaining -= splitPct;
        return { ...r, pct: splitPct.toFixed(2) };
      }
    });
};

const test1 = [
    { name: 'A', pct: '0.00' },
    { name: 'B', pct: '0.00' },
    { name: 'C', pct: '0.00' },
    { name: '', pct: '0.00' },
    { name: '', pct: '0.00' },
];
console.log("Test 3 elements:", recalculatePercentages(test1));

const test2 = [
    { name: 'A', pct: '0.00' },
    { name: 'B', pct: '0.00' },
    { name: 'C', pct: '0.00' },
    { name: 'D', pct: '0.00' },
    { name: '', pct: '0.00' },
];
console.log("Test 4 elements:", recalculatePercentages(test2));

const test3 = [
    { name: 'A', pct: '0.00' },
    { name: 'B', pct: '0.00' },
    { name: 'C', pct: '0.00' },
    { name: 'D', pct: '0.00' },
    { name: 'E', pct: '0.00' },
];
console.log("Test 5 elements:", recalculatePercentages(test3));

const test4 = [
    { name: 'A', pct: '0.00' },
    { name: 'B', pct: '0.00' },
    { name: 'C', pct: '0.00' },
    { name: 'D', pct: '0.00' },
    { name: 'E', pct: '0.00' },
    { name: 'F', pct: '0.00' }, // 6 elements
];
console.log("Test 6 elements:", recalculatePercentages(test4));
