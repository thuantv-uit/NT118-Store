export function formatVND(value) {
  if (value === null || value === undefined || value === '') return '';
  // Accept numbers or numeric strings like "44444.00"
  const cleaned = String(value).replace(/[^0-9.-]+/g, '');
  const num = Number(cleaned);
  if (!isFinite(num)) return String(value);
  // Round to nearest integer VND
  const rounded = Math.round(num);
  // format with dot as thousands separator
  return String(rounded).replace(/\B(?=(\d{3})+(?!\d))/g, '.') + '₫';
}
