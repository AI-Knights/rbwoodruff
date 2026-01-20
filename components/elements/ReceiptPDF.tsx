import { Document, Page, Text, View, StyleSheet, pdf } from '@react-pdf/renderer';
import { Payment } from '@/types/admin/payment.type';
import { format } from 'date-fns';

// Optional: Register a nice font (Inter or Roboto) – but for simplicity, we'll use Helvetica
// If you want better fonts, download and register one (e.g., Inter)

const styles = StyleSheet.create({
  page: { padding: 40, fontFamily: 'Helvetica', fontSize: 12 },
  header: { fontSize: 24, marginBottom: 20, textAlign: 'center', fontWeight: 'bold' },
  section: { marginBottom: 20 },
  title: { fontSize: 16, marginBottom: 10, fontWeight: 'bold', color: '#1f2937' },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  label: { color: '#6b7280', width: '40%' },
  value: { fontWeight: 'bold', width: '60%', textAlign: 'right' },
  badge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6, alignSelf: 'flex-start', marginTop: 10 },
  success: { backgroundColor: '#d4edda', color: '#155724' },
  pending: { backgroundColor: '#fff3cd', color: '#856404' },
  footer: { marginTop: 40, textAlign: 'center', fontSize: 10, color: '#9ca3af' },
});

interface ReceiptPDFProps {
  payment: Payment;
}

const ReceiptPDF: React.FC<ReceiptPDFProps> = ({ payment }) => {
  const formattedDate = format(new Date(payment.created_at), 'dd MMMM yyyy, HH:mm:ss');

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.header}>Payment Receipt</Text>

        <View style={styles.section}>
          <Text style={styles.title}>Transaction Details</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Transaction ID</Text>
            <Text style={styles.value}>{payment.id}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Receipt Number</Text>
            <Text style={styles.value}>{payment.receipt_number || 'N/A'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Date & Time</Text>
            <Text style={styles.value}>{formattedDate}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Status</Text>
            <View style={[styles.badge, payment.status === 'succeeded' ? styles.success : styles.pending]}>
              <Text>{payment.status === 'succeeded' ? 'Success' : 'Pending'}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.title}>Customer Information</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Name</Text>
            <Text style={styles.value}>{payment.user_name}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Email</Text>
            <Text style={styles.value}>{payment.user_email}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.title}>Payment Details</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Amount</Text>
            <Text style={styles.value}>
              ${parseFloat(payment.amount).toFixed(2)} {payment.currency.toUpperCase()}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Payment Method</Text>
            <Text style={styles.value}>{payment.payment_method.charAt(0).toUpperCase() + payment.payment_method.slice(1)}</Text>
          </View>
        </View>

        <Text style={styles.footer}>
          Thank you for your payment. This is a computer-generated receipt.
        </Text>
      </Page>
    </Document>
  );
};

export const generateReceiptPDF = async (payment: Payment) => {
  const blob = await pdf(<ReceiptPDF payment={payment} />).toBlob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `receipt_${payment.id.slice(0, 8)}.pdf`;
  link.click();
  URL.revokeObjectURL(url);
};