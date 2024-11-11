import { useState, useEffect } from "react";
import { Alert } from "react-native";
import { View, StyleSheet, TextInput, ScrollView, Pressable } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

type MatrixType = string[][];

export default function SubtractionCalculator() {
  const [dimensions, setDimensions] = useState({
    matrixA: { rows: "2", cols: "2" },
    matrixB: { rows: "2", cols: "2" }
  });
  
  const [matrices, setMatrices] = useState({
    matrixA: [["0", "0"], ["0", "0"]],
    matrixB: [["0", "0"], ["0", "0"]],
    result: [] as string[][]
  });

  const [order, setOrder] = useState<'AB' | 'BA'>('AB');

  // Same useEffect as addition for matrix size management
  useEffect(() => {
    const createMatrix = (rows: number, cols: number) => 
      Array(rows).fill(0).map(() => Array(cols).fill("0"));

    const updateMatrixSize = (current: MatrixType, rows: number, cols: number) => {
      const newMatrix = createMatrix(rows, cols);
      for (let i = 0; i < Math.min(rows, current.length); i++) {
        for (let j = 0; j < Math.min(cols, current[0].length); j++) {
          newMatrix[i][j] = current[i][j];
        }
      }
      return newMatrix;
    };

    const rowsA = Math.max(1, Math.min(10, parseInt(dimensions.matrixA.rows) || 2));
    const colsA = Math.max(1, Math.min(10, parseInt(dimensions.matrixA.cols) || 2));

    setMatrices(prev => ({
      ...prev,
      matrixA: updateMatrixSize(prev.matrixA, rowsA, colsA),
      matrixB: updateMatrixSize(prev.matrixB, rowsA, colsA)
    }));
  }, [dimensions.matrixA.rows, dimensions.matrixA.cols]);

  // Keep matrices same size for subtraction
  useEffect(() => {
    const rowsA = dimensions.matrixA.rows;
    const colsA = dimensions.matrixA.cols;
    
    if (dimensions.matrixB.rows !== rowsA || dimensions.matrixB.cols !== colsA) {
      setDimensions(prev => ({
        ...prev,
        matrixB: { rows: rowsA, cols: colsA }
      }));
    }
  }, [dimensions.matrixA.rows, dimensions.matrixA.cols]);

  // Matrix update handler
  const updateMatrix = (matrixKey: 'matrixA' | 'matrixB', rowIndex: number, colIndex: number, value: string) => {
    const newValue = value.replace(/[^-0-9.]/g, '');
    setMatrices(prev => ({
      ...prev,
      [matrixKey]: prev[matrixKey].map((row, r) =>
        row.map((cell, c) => 
          r === rowIndex && c === colIndex ? newValue : cell
        )
      )
    }));
  };

  // Dimension change handler
  const handleDimensionChange = (
    matrix: 'matrixA' | 'matrixB',
    type: 'rows' | 'cols',
    value: string
  ) => {
    const numValue = value.replace(/[^0-9]/g, '');
    const validValue = numValue === '' ? '1' : 
                      parseInt(numValue) < 1 ? '1' : 
                      parseInt(numValue) > 10 ? '10' : numValue;

    setDimensions(prev => ({
      ...prev,
      [matrix]: {
        ...prev[matrix],
        [type]: validValue
      }
    }));
  };

  // Validation
  const validateMatrices = () => {
    const rowsA = matrices.matrixA.length;
    const colsA = matrices.matrixA[0].length;
    const rowsB = matrices.matrixB.length;
    const colsB = matrices.matrixB[0].length;

    if (rowsA !== rowsB || colsA !== colsB) {
      Alert.alert(
        "Invalid Dimensions",
        "Both matrices must have the same dimensions for subtraction."
      );
      return false;
    }

    const hasInvalidNumbers = [...matrices.matrixA, ...matrices.matrixB].some(row =>
      row.some(cell => isNaN(parseFloat(cell)))
    );

    if (hasInvalidNumbers) {
      Alert.alert(
        "Invalid Input",
        "All cells must contain valid numbers."
      );
      return false;
    }

    return true;
  };

  // Subtraction operation
  const subtractMatrices = () => {
    if (!validateMatrices()) return;

    const firstMatrix = order === 'AB' ? matrices.matrixA : matrices.matrixB;
    const secondMatrix = order === 'AB' ? matrices.matrixB : matrices.matrixA;
    
    const result = firstMatrix.map((row, i) =>
      row.map((_, j) => {
        const difference = parseFloat(firstMatrix[i][j]) - parseFloat(secondMatrix[i][j]);
        return difference.toFixed(2);
      })
    );
    setMatrices(prev => ({ ...prev, result }));
  };

  // Matrix rendering function (same as addition)
  const renderMatrix = (
    matrixKey: 'matrixA' | 'matrixB',
    matrix: MatrixType,
    title: string
  ) => (
    <ThemedView style={styles.matrixWrapper}>
      <ThemedText style={styles.matrixTitle}>{title}</ThemedText>
      <ThemedView style={styles.dimensionsContainer}>
        <View style={styles.dimensionInput}>
          <ThemedText>Rows:</ThemedText>
          <TextInput
            style={styles.input}
            value={dimensions[matrixKey].rows}
            onChangeText={(text) => handleDimensionChange(matrixKey, 'rows', text)}
            keyboardType="number-pad"
            maxLength={2}
            placeholder="2"
          />
        </View>
        <View style={styles.dimensionInput}>
          <ThemedText>Cols:</ThemedText>
          <TextInput
            style={styles.input}
            value={dimensions[matrixKey].cols}
            onChangeText={(text) => handleDimensionChange(matrixKey, 'cols', text)}
            keyboardType="number-pad"
            maxLength={2}
            placeholder="2"
          />
        </View>
      </ThemedView>

      <ThemedView style={styles.matrixContainer}>
        {matrix.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((cell, colIndex) => (
              <TextInput
                key={`${rowIndex}-${colIndex}`}
                style={styles.cell}
                value={cell}
                onChangeText={(text) => updateMatrix(matrixKey, rowIndex, colIndex, text)}
                keyboardType="numeric"
                maxLength={8}
                selectTextOnFocus
              />
            ))}
          </View>
        ))}
      </ThemedView>
    </ThemedView>
  );

  return (
    <ScrollView>
      <ThemedView style={styles.container}>
        <ThemedText type="title" style={styles.title}>
          Matrix Subtraction
        </ThemedText>

        <ThemedView style={styles.orderContainer}>
          <ThemedText>Order: </ThemedText>
          <Pressable
            style={[
              styles.orderButton,
              order === 'AB' && styles.orderButtonSelected
            ]}
            onPress={() => setOrder('AB')}
          >
            <ThemedText style={[
              styles.orderButtonText,
              order === 'AB' && styles.orderButtonTextSelected
            ]}>
              A - B
            </ThemedText>
          </Pressable>
          <Pressable
            style={[
              styles.orderButton,
              order === 'BA' && styles.orderButtonSelected
            ]}
            onPress={() => setOrder('BA')}
          >
            <ThemedText style={[
              styles.orderButtonText,
              order === 'BA' && styles.orderButtonTextSelected
            ]}>
              B - A
            </ThemedText>
          </Pressable>
        </ThemedView>

        {renderMatrix('matrixA', matrices.matrixA, 'Matrix A')}
        {renderMatrix('matrixB', matrices.matrixB, 'Matrix B')}

        <ThemedView style={styles.buttonsContainer}>
          <Pressable 
            style={({pressed}) => [
              styles.button,
              styles.operationButton,
              pressed && styles.buttonPressed
            ]}
            onPress={subtractMatrices}
          >
            <ThemedText style={styles.buttonText}>Subtract Matrices</ThemedText>
          </Pressable>

          <Pressable 
            style={({pressed}) => [
              styles.button,
              styles.clearButton,
              pressed && styles.buttonPressed
            ]}
            onPress={() => setMatrices(prev => ({
              matrixA: prev.matrixA.map(row => row.map(() => "0")),
              matrixB: prev.matrixB.map(row => row.map(() => "0")),
              result: []
            }))}
          >
            <ThemedText style={styles.buttonText}>Clear All</ThemedText>
          </Pressable>
        </ThemedView>

        {matrices.result.length > 0 && (
          <ThemedView style={styles.resultWrapper}>
            <ThemedView style={styles.matrixWrapper}>
              <ThemedText style={styles.matrixTitle}>Result</ThemedText>
              <ThemedView style={styles.matrixContainer}>
                {matrices.result.map((row, rowIndex) => (
                  <View key={rowIndex} style={styles.row}>
                    {row.map((cell, colIndex) => (
                      <ThemedView key={`${rowIndex}-${colIndex}`} style={styles.resultCell}>
                        <ThemedText>{cell}</ThemedText>
                      </ThemedView>
                    ))}
                  </View>
                ))}
              </ThemedView>
            </ThemedView>
          </ThemedView>
        )}
      </ThemedView>
    </ScrollView>
  );
}

// Use the same styles as addition component
const styles = StyleSheet.create({

    container: {
  
      flex: 1,
  
      padding: 20,
  
      alignItems: "center",
  
    },
  
    title: {
  
      marginBottom: 30,
  
    },
  
    matrixWrapper: {
  
      marginBottom: 30,
  
      width: '100%',
  
      alignItems: 'center',
  
    },
  
    matrixTitle: {
  
      fontSize: 20,
  
      fontWeight: '600',
  
      marginBottom: 15,
  
    },
  
    dimensionsContainer: {
  
      flexDirection: "row",
  
      gap: 20,
  
      marginBottom: 15,
  
    },
  
    dimensionInput: {
  
      flexDirection: "row",
  
      alignItems: "center",
  
      gap: 10,
  
    },
  
    input: {
  
      borderWidth: 1,
  
      borderColor: "#0a7ea4",
  
      borderRadius: 8,
  
      padding: 8,
  
      width: 60,
  
      textAlign: "center",
  
      backgroundColor: "white",
  
    },
  
    matrixContainer: {
  
      padding: 20,
  
      borderRadius: 16,
  
      backgroundColor: "rgba(10, 126, 164, 0.1)",
  
    },
  
    row: {
  
      flexDirection: "row",
  
      gap: 10,
  
      marginBottom: 10,
  
    },
  
    cell: {
  
      width: 50,
  
      height: 50,
  
      borderWidth: 1,
  
      borderColor: "#0a7ea4",
  
      borderRadius: 8,
  
      textAlign: "center",
  
      backgroundColor: "white",
  
    },
  
    resultCell: {
  
      width: 50,
  
      height: 50,
  
      borderWidth: 1,
  
      borderColor: "#0a7ea4",
  
      borderRadius: 8,
  
      backgroundColor: "rgba(10, 126, 164, 0.1)",
  
      justifyContent: 'center',
  
      alignItems: 'center',
  
    },
  
    buttonsContainer: {
  
      flexDirection: "row",
  
      flexWrap: "wrap",
  
      gap: 15,
  
      marginTop: 20,
  
      justifyContent: 'center',
  
    },
  
    button: {
  
      paddingHorizontal: 24,
  
      paddingVertical: 12,
  
      borderRadius: 8,
  
      elevation: 2,
  
      shadowColor: "#000",
  
      shadowOffset: {
  
        width: 0,
  
        height: 2,
  
      },
  
      shadowOpacity: 0.25,
  
      shadowRadius: 3.84,
  
      minWidth: 100,
  
      alignItems: 'center',
  
    },
  
    operationButton: {
  
      backgroundColor: "#0a7ea4",
  
    },
  
    buttonPressed: {
  
      opacity: 0.8,
  
      transform: [{ scale: 0.98 }],
  
    },
  
    clearButton: {
  
      backgroundColor: "#dc3545",
  
    },
  
    buttonText: {
  
      color: "white",
  
      fontSize: 16,
  
      fontWeight: "600",
  
    },
  
    orderContainer: {
  
      flexDirection: 'row',
  
      alignItems: 'center',
  
      gap: 10,
  
      marginBottom: 20,
  
    },
  
    orderButton: {
  
      paddingHorizontal: 16,
  
      paddingVertical: 8,
  
      borderRadius: 8,
  
      borderWidth: 1,
  
      borderColor: '#0a7ea4',
  
    },
  
    orderButtonSelected: {
  
      backgroundColor: '#0a7ea4',
  
    },
  
    orderButtonText: {
  
      color: '#0a7ea4',
  
      fontSize: 16,
  
      fontWeight: '600',
  
    },
  
    orderButtonTextSelected: {
  
      color: 'white',
  
    },
  
    resultWrapper: {
  
      marginTop: 40,
  
      width: '100%',
  
    },
  
  });