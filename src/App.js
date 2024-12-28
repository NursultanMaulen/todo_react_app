import {
  Button,
  Container,
  Text,
  Title,
  Modal,
  TextInput,
  Group,
  Card,
  ActionIcon,
  Select,
} from "@mantine/core";
import { useState, useRef, useEffect } from "react";
import { Checkbox, MoonStars, Sun, Trash } from "tabler-icons-react";

import { MantineProvider, ColorSchemeProvider } from "@mantine/core";
import { useHotkeys, useLocalStorage } from "@mantine/hooks";

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [opened, setOpened] = useState(false);
  const [states, setStates] = useState("");
  const [stateChange, setStateChange] = useState(false);
  const [editIndex, setEditIndex] = useState(0);

  const [colorScheme, setColorScheme] = useLocalStorage({
    key: "mantine-color-scheme",
    defaultValue: "light",
    getInitialValueInEffect: true,
  });
  const toggleColorScheme = (value) =>
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));

  useHotkeys([["mod+J", () => toggleColorScheme()]]);

  const taskTitle = useRef("");
  const taskSummary = useRef("");
  const taskState = useRef("");

  function createTask() {
    tasks.push({
      title: taskTitle.current.value,
      summary: taskSummary.current.value,
      state: taskState.current.value,
    });
    loadTasks();
    setTasks(tasks);
    saveTasks(tasks);
  }

  function deleteTask(index) {
    var clonedTasks = tasks;

    clonedTasks.splice(index, 1);

    setTasks(clonedTasks);
    saveTasks(clonedTasks);
    loadTasks();
  }

  function sortTasks(state) {
    const sortedTasks = [...tasks].sort((a, b) =>
      a.state === state ? -1 : b.state === state ? 1 : 0
    );
    setTasks(sortedTasks);
    saveTasks(sortedTasks);
  }

  function loadTasks() {
    let loadedTasks = localStorage.getItem("tasks");

    let tasks = JSON.parse(loadedTasks);

    if (tasks) {
      setTasks(tasks);
    }
  }

  function updateState(index) {
    var clonedTasks = tasks;

    clonedTasks[index].state = taskState.current.value

    setTasks(clonedTasks);
    saveTasks(clonedTasks);
    loadTasks();
  }

  function filterTasks(state) {
    const filteredTasks = tasks.filter((task) => task.state === state);
    setTasks(filteredTasks);
  }

  function editTask(index) {
    const updatedTasks = [...tasks];
    updatedTasks[index] = {
      title: taskTitle.current.value,
      summary: taskSummary.current.value,
      state: taskState.current.value,
    };
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
    setStateChange(false);
  }
  


  function saveTasks(tasks) {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  useEffect(() => {
    loadTasks();
  }, []);

  return (
    <ColorSchemeProvider
      colorScheme={colorScheme}
      toggleColorScheme={toggleColorScheme}
    >
      <MantineProvider
        theme={{ colorScheme, defaultRadius: "md" }}
        withGlobalStyles
        withNormalizeCSS
      >
        <div className="App">
          <Modal
            opened={opened}
            size={"md"}
            title={"New Task"}
            withCloseButton={false}
            onClose={() => {
              setOpened(false);
            }}
            centered
          >
            <TextInput
              mt={"md"}
              ref={taskTitle}
              placeholder={"Task Title"}
              required
              label={"Title"}
            />
            <TextInput
              ref={taskSummary}
              mt={"md"}
              placeholder={"Task Summary"}
              label={"Summary"}
            />
            <Select
              data={["Done", "Not done", "Doing right now"]}
              ref={taskState}
              label="State"
              placeholder="Select state"
              required
            />


            <Group mt={"md"} position={"apart"}>
              <Button
                onClick={() => {
                  setOpened(false);
                }}
                variant={"subtle"}
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  createTask();
                }}
              >
                Create Task
              </Button>
            </Group>
          </Modal>
          <Modal
            opened={stateChange}
            size={"md"}
            title={"New State"}
            withCloseButton={false}
            onClose={() => {
              setStateChange(false);
            }}
            centered
          >
            <TextInput
              mt={"md"}
              ref={taskTitle}
              placeholder={"Task Title"}
              required
              label={"Title"}
            />
            <TextInput
              ref={taskSummary}
              mt={"md"}
              placeholder={"Task Summary"}
              label={"Summary"}
            />
            <Select
              data={["Done", "Not done", "Doing right now"]}
              ref={taskState}
              label="State"
              placeholder="Select state"
              required
            />
            <Group mt={"md"} position={"apart"}>
              <Button
                onClick={() => {
                  setStateChange(false);
                }}
                variant={"subtle"}
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  editTask(editIndex);
                }}
              >
                Edit Task
              </Button>
            </Group>
          </Modal>
          <Container size={550} my={40}>
          <Button onClick={() => sortTasks("Done")}>Show "Done" First</Button>
          <Button onClick={() => sortTasks("Doing right now")}>Show "Doing" First</Button>
          <Button onClick={() => sortTasks("Not done")}>Show "Not Done" First</Button>

          <Button onClick={() => filterTasks("Done")}>Show Only "Done"</Button>
          <Button onClick={() => filterTasks("Not done")}>Show Only "Not Done"</Button>
          <Button onClick={() => filterTasks("Doing right now")}>
            Show Only "Doing"
          </Button>

            <Group position={"apart"}>
              <Title
                sx={(theme) => ({
                  fontFamily: `Greycliff CF, ${theme.fontFamily}`,
                  fontWeight: 900,
                })}
              >
                My Tasks
              </Title>
              <ActionIcon
                color={"blue"}
                onClick={() => toggleColorScheme()}
                size="lg"
              >
                {colorScheme === "dark" ? (
                  <Sun size={16} />
                ) : (
                  <MoonStars size={16} />
                )}
              </ActionIcon>
            </Group>
            {tasks.length > 0 ? (
              tasks.map((task, index) => {
                if (task.title) {
                  return (
                    <Card withBorder key={index} mt={"sm"}>
                      <Group position={"apart"}>
                        <Text weight={"bold"}>{task.title}</Text>
                        <ActionIcon
                          onClick={() => {
                            deleteTask(index);
                          }}
                          color={"red"}
                          variant={"transparent"}
                        >
                          <Trash />
                        </ActionIcon>
                        <ActionIcon
                          onClick={() => {
                            setStateChange(true);
                            setEditIndex(index);
                          }}
                          color={"blue"}
                          variant={"transparent"}
                        >
                          Edit
                        </ActionIcon>
                      </Group>
                      <Text color={"dimmed"} size={"md"} mt={"sm"}>
                        {task.summary
                          ? task.summary
                          : "No summary was provided for this task"}
                      </Text>
                      <TextInput
                        ref={taskState}
                        mt={"md"}
                        placeholder={task.state}
                        label={"State"}
                        onKeyDown={(e) => {
                          if (e.key === "Enter")
                              updateState(index);
                          }}
                      ></TextInput>
                    </Card>
                  );
                }
              })
            ) : (
              <Text size={"lg"} mt={"md"} color={"dimmed"}>
                You have no tasks
              </Text>
            )}
            <Button
              onClick={() => {
                setOpened(true);
              }}
              fullWidth
              mt={"md"}
            >
              New Task
            </Button>
          </Container>
        </div>
      </MantineProvider>
    </ColorSchemeProvider>
  );
}
