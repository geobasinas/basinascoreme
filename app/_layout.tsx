import { Tabs } from "expo-router";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";

export default function RootLayout() {
  return (
    <Tabs screenOptions={{
      headerStyle: {
        backgroundColor: '#0a7ea4',
      },
      headerTintColor: '#fff',
      tabBarActiveTintColor: '#0a7ea4',
    }}>
      <Tabs.Screen 
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
        }}
      />
      <Tabs.Screen 
        name="addition"
        options={{
          title: "Addition",
          tabBarIcon: ({ color }) => <TabBarIcon name="add" color={color} />,
        }}
      />
      <Tabs.Screen 
        name="subtraction"
        options={{
          title: "Subtraction",
          tabBarIcon: ({ color }) => <TabBarIcon name="remove" color={color} />,
        }}
      />
      <Tabs.Screen 
        name="multiplication"
        options={{
          title: "Multiplication",
          tabBarIcon: ({ color }) => <TabBarIcon name="close" color={color} />,
        }}
      />
      <Tabs.Screen 
        name="determinant"
        options={{
          title: "Determinant",
          tabBarIcon: ({ color }) => <TabBarIcon name="calculator" color={color} />,
        }}
      />
    </Tabs>
  );
}
