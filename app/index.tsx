import { Link } from "expo-router";
import { StyleSheet, ScrollView, Pressable } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";

export default function HomeScreen() {
  return (
    <ScrollView>
      <ThemedView style={styles.container}>
        <ThemedText type="title" style={styles.title}>
          Matrix Calculator
        </ThemedText>

        <ThemedText style={styles.description}>
          A powerful tool for matrix operations. Choose an operation to begin:
        </ThemedText>

        <ThemedView style={styles.operationsContainer}>
          <Link href="/addition" asChild>
            <Pressable style={styles.operationCard}>
              <TabBarIcon name="add-circle-outline" color="#0a7ea4" size={48} />
              <ThemedText style={styles.operationTitle}>Addition</ThemedText>
              <ThemedText style={styles.operationDescription}>
                Add two matrices of the same dimensions
              </ThemedText>
            </Pressable>
          </Link>

          <Link href="/subtraction" asChild>
            <Pressable style={styles.operationCard}>
              <TabBarIcon name="remove-circle-outline" color="#0a7ea4" size={48} />
              <ThemedText style={styles.operationTitle}>Subtraction</ThemedText>
              <ThemedText style={styles.operationDescription}>
                Subtract two matrices of the same dimensions
              </ThemedText>
            </Pressable>
          </Link>

          <Link href="/multiplication" asChild>
            <Pressable style={styles.operationCard}>
              <TabBarIcon name="close-circle-outline" color="#0a7ea4" size={48} />
              <ThemedText style={styles.operationTitle}>Multiplication</ThemedText>
              <ThemedText style={styles.operationDescription}>
                Multiply two matrices where columns of A equal rows of B
              </ThemedText>
            </Pressable>
          </Link>

          <Link href="/determinant" asChild>
            <Pressable style={styles.operationCard}>
              <TabBarIcon name="calculator-outline" color="#0a7ea4" size={48} />
              <ThemedText style={styles.operationTitle}>Determinant</ThemedText>
              <ThemedText style={styles.operationDescription}>
                Calculate the determinant of a square matrix
              </ThemedText>
            </Pressable>
          </Link>
        </ThemedView>

        <ThemedView style={styles.infoContainer}>
          <ThemedText type="subtitle" style={styles.infoTitle}>
            Features:
          </ThemedText>
          <ThemedText style={styles.infoText}>
            • Support for matrices up to 10×10{'\n'}
            • Real-time validation{'\n'}
            • Order selection for operations{'\n'}
            • Determinant calculation{'\n'}
            • Clear and intuitive interface
          </ThemedText>
        </ThemedView>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: "center",
  },
  title: {
    marginBottom: 20,
    fontSize: 36,
  },
  description: {
    textAlign: 'center',
    marginBottom: 30,
    fontSize: 16,
    lineHeight: 24,
    maxWidth: '80%',
  },
  operationsContainer: {
    width: '100%',
    gap: 20,
    marginBottom: 40,
  },
  operationCard: {
    backgroundColor: 'rgba(10, 126, 164, 0.1)',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#0a7ea4',
  },
  operationTitle: {
    fontSize: 24,
    fontWeight: '600',
    marginTop: 10,
    marginBottom: 8,
    color: '#0a7ea4',
  },
  operationDescription: {
    textAlign: 'center',
    opacity: 0.7,
  },
  infoContainer: {
    width: '100%',
    backgroundColor: 'rgba(10, 126, 164, 0.05)',
    borderRadius: 16,
    padding: 20,
  },
  infoTitle: {
    marginBottom: 12,
    color: '#0a7ea4',
  },
  infoText: {
    lineHeight: 24,
  },
});
