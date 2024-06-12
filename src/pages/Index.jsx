import React, { useEffect, useState } from "react";
import { Container, VStack, Text, Link, Input, Box, useColorMode, IconButton } from "@chakra-ui/react";
import { FaMoon, FaSun } from "react-icons/fa";

const Index = () => {
  const [stories, setStories] = useState([]);
  const [filteredStories, setFilteredStories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { colorMode, toggleColorMode } = useColorMode();

  useEffect(() => {
    const fetchTopStories = async () => {
      try {
        const response = await fetch("https://hacker-news.firebaseio.com/v0/topstories.json");
        const storyIds = await response.json();
        const top5StoryIds = storyIds.slice(0, 5);

        const storyPromises = top5StoryIds.map(async (id) => {
          const storyResponse = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
          return storyResponse.json();
        });

        const stories = await Promise.all(storyPromises);
        setStories(stories);
        setFilteredStories(stories);
      } catch (error) {
        console.error("Error fetching top stories:", error);
      }
    };

    fetchTopStories();
  }, []);

  useEffect(() => {
    const filtered = stories.filter((story) =>
      story.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredStories(filtered);
  }, [searchTerm, stories]);

  return (
    <Container centerContent maxW="container.md" py={4}>
      <VStack spacing={4} width="100%">
        <Box width="100%" display="flex" justifyContent="space-between" alignItems="center">
          <Text fontSize="2xl">Top 5 Hacker News Stories</Text>
          <IconButton
            aria-label="Toggle dark mode"
            icon={colorMode === "light" ? <FaMoon /> : <FaSun />}
            onClick={toggleColorMode}
          />
        </Box>
        <Input
          placeholder="Search stories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <VStack spacing={4} width="100%" overflowY="auto" maxHeight="60vh">
          {filteredStories.map((story) => (
            <Box key={story.id} p={4} borderWidth="1px" borderRadius="md" width="100%">
              <Text fontSize="lg" fontWeight="bold">
                {story.title}
              </Text>
              <Text>Upvotes: {story.score}</Text>
              <Link href={story.url} color="teal.500" isExternal>
                Read more
              </Link>
            </Box>
          ))}
        </VStack>
      </VStack>
    </Container>
  );
};

export default Index;