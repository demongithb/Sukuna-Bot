export async function deviceid() {
  return `MAY-${Math.random().toString(36).substring(2, 12)}`;
}
