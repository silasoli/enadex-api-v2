class FormatUtilCls {
  formatDate(date: Date): string {
    return date
      .toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })
      .split(' ')[0];
  }
  toPTBRDateString(date: Date): string {
    return date.toLocaleDateString('pt-br');
  }
  capitalizeFirst(text: string): string {
    return text.toLowerCase().replace(/(?:^|\s)\S/g, function (a) {
      return a.toUpperCase();
    });
  }
  formatCPF(document: string): string {
    return document.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }
  formatPhone(phone: string): string {
    if (phone.length === 13 && phone.startsWith('55'))
      phone = phone.substring(2);

    return `(${phone.substring(0, 2)}) ${phone.substring(2, 3)} ${phone.substring(3, 7)}-${phone.substring(7)}`;
  }
}

export const FormatUtil = new FormatUtilCls();
