export const calculateTotalBalance = (payments: any[]) => {
  return payments.reduce((total, payment) => total + Number(payment.amount), 0);
};

export const calculateMonthlyIncome = (payments: any[]) => {
  const currentDate = new Date();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  
  return payments
    .filter(payment => {
      const paymentDate = new Date(payment.payment_date);
      return paymentDate >= firstDayOfMonth && Number(payment.amount) > 0;
    })
    .reduce((total, payment) => total + Number(payment.amount), 0);
};

export const calculateMonthlyExpenses = (payments: any[]) => {
  const currentDate = new Date();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  
  return Math.abs(payments
    .filter(payment => {
      const paymentDate = new Date(payment.payment_date);
      return paymentDate >= firstDayOfMonth && Number(payment.amount) < 0;
    })
    .reduce((total, payment) => total + Number(payment.amount), 0));
};

export const calculatePercentageChange = (current: number, previous: number) => {
  if (previous === 0) return 0;
  return ((current - previous) / Math.abs(previous)) * 100;
};