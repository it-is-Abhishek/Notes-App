import React, { useContext, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Animated,
  Easing,
} from "react-native";
import { NotesContext } from "../contexts/NotesContext";
import { MaterialIcons } from "@expo/vector-icons";

export default function HomeScreen({ navigation }) {
  const { notes } = useContext(NotesContext);
  const [search, setSearch] = useState("");


  const floatAnim = useState(new Animated.Value(0))[0];
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: 1,
          duration: 1200,
          easing: Easing.sin,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 1200,
          easing: Easing.sin,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const bounceAnim = useState(new Animated.Value(1))[0];
  const onMascotTap = () => {
    Animated.sequence([
      Animated.timing(bounceAnim, {
        toValue: 1.25,
        duration: 150,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease),
      }),
      Animated.spring(bounceAnim, {
        toValue: 1,
        friction: 3,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const favoriteCount = notes.filter((n) => n.isFavorite).length;
  const categoryCount = (cat) => notes.filter((n) => n.category === cat).length;

  const filteredNotes = notes.filter(
    (n) =>
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      (n.content && n.content.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <View style={styles.container}>

      <Animated.View
        style={{
          transform: [
            {
              translateY: floatAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [-6, 6],
              }),
            },
          ],
        }}
      >
        <Text style={styles.header}>Abhishek's Notes 🧠</Text>
      </Animated.View>


      <Animated.View
        style={{ transform: [{ scale: bounceAnim }], marginVertical: 16 }}
      >
        <TouchableOpacity onPress={onMascotTap}>
          <Text style={{ fontSize: 44 }}>📝</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* 🔍 Search bar */}
      <View style={styles.searchBar}>
        <MaterialIcons name="search" size={20} />
        <TextInput
          placeholder="Search notes..."
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
        />
      </View>

      {/* 🫧 Category section */}
      <View style={styles.catContainer}>
        {["Work", "Study", "Personal"].map((cat, i) => (
          <TouchableOpacity
            key={cat}
            style={styles.catBubble}
            onPress={() => navigation.navigate("Category", { category: cat })}
          >
            <MaterialIcons name="folder" size={26} />
            <Text style={styles.catText}>{cat}</Text>
            <Animated.Text style={styles.catCount}>
              {categoryCount(cat)}
            </Animated.Text>
          </TouchableOpacity>
        ))}
      </View>


      {favoriteCount > 0 && (
        <TouchableOpacity
          style={styles.favRow}
          onPress={() =>
            navigation.navigate("Category", { category: "Favorites" })
          }
        >
          <MaterialIcons name="star" size={22} color="gold" />
          <Text style={styles.favText}>Favorites ({favoriteCount})</Text>
        </TouchableOpacity>
      )}


      {search && (
        <Animated.View style={styles.resultsContainer}>
          {filteredNotes.length === 0 ? (
            <Text style={styles.empty}>No results found 🥲</Text>
          ) : (
            filteredNotes.map((note) => (
              <TouchableOpacity
                key={note.id}
                style={styles.resultCard}
                onPress={() => navigation.navigate("NoteDetails", { note })}
              >
                <Text style={styles.cardTitle}>{note.title}</Text>
                <Text numberOfLines={1} style={styles.cardContent}>
                  {note.audioUri ? "🎙️ Voice Note" : note.content}
                </Text>
              </TouchableOpacity>
            ))
          )}
        </Animated.View>
      )}


      <TouchableOpacity
        style={styles.addBtn}
        onPress={() => navigation.navigate("AddNote")}
      >
        <MaterialIcons name="add" size={26} color="#fff" />
      </TouchableOpacity>


      <TouchableOpacity
        style={styles.micBtn}
        onPress={() =>
          navigation.navigate("AddNote", {
            category: "Personal",
            voiceMode: true,
          })
        }
      >
        <MaterialIcons name="mic" size={26} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  header: { fontSize: 26, fontWeight: "800", marginBottom: 16 },
  searchBar: {
    flexDirection: "row",
    backgroundColor: "#f4f4f4",
    width: "90%",
    padding: 12,
    borderRadius: 20,
    gap: 8,
    alignItems: "center",
    elevation: 3,
    marginBottom: 10,
  },
  searchInput: { flex: 1, fontSize: 16 },
  catContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    flexWrap: "wrap",
    marginTop: 14,
  },
  catBubble: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: "30%",
    padding: 14,
    backgroundColor: "#ffeaa7",
    borderRadius: 18,
    marginVertical: 6,
    elevation: 3,
    position: "relative",
  },
  catText: { fontSize: 16, fontWeight: "700", marginTop: 6 },
  catCount: {
    fontSize: 14,
    position: "absolute",
    top: 8,
    right: 8,
    fontWeight: "bold",
    color: "#333",
  },
  favRow: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 12 },
  favText: { fontSize: 17, fontWeight: "600" },
  resultsContainer: { width: "90%", marginTop: 10 },
  resultCard: {
    backgroundColor: "#fafafa",
    padding: 12,
    borderRadius: 12,
    marginVertical: 5,
    elevation: 2,
    width: "100%",
  },
  cardTitle: { fontSize: 17, fontWeight: "bold" },
  cardContent: { fontSize: 14, color: "#666", marginTop: 4 },
  empty: { fontSize: 16, color: "gray", textAlign: "center", marginTop: 20 },
  addBtn: {
    position: "absolute",
    bottom: 30,
    left: 30,
    height: 56,
    width: 56,
    borderRadius: 28,
    backgroundColor: "#00b894",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
  micBtn: {
    position: "absolute",
    bottom: 30,
    right: 30,
    height: 56,
    width: 56,
    borderRadius: 28,
    backgroundColor: "#0984e3",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
});
