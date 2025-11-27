import { useQuery } from "@tanstack/react-query";
import { createStore, createEvent, createEffect, sample } from "effector";
import { useUnit } from "effector-react";

const localStorageKey = "timerSeconds";

// timer state

export const getTimerStateFX = createEffect(async () => {
  await new Promise((res) => setTimeout(res, 1000));

  return Number(localStorage.getItem(localStorageKey)) ?? 0;
});

export const addSecond = createEvent();

export const $timerStateSeconds = createStore(0)
  .on(addSecond, (prev) => prev + 1)
  .on(getTimerStateFX.doneData, (_, data) => data);

export const useTimerStateSeconds = () => useUnit($timerStateSeconds);
export const useTimerStateQuery = () =>
  useQuery({ queryKey: ["timerState"], queryFn: () => getTimerStateFX() });

// timer status

export const setPauseTimerStatus = createEvent();
export const toggleTimerStatus = createEvent();

export const $timerStatus = createStore<"running" | "paused">("paused")
  .on(toggleTimerStatus, (state) =>
    state === "running" ? "paused" : "running"
  )
  .on(setPauseTimerStatus, () => "paused");

export const $isTimerRunning = $timerStatus.map(
  (status) => status === "running"
);

export const useIsTimerRunning = () => useUnit($isTimerRunning);

sample({
  clock: $timerStatus,
  source: $timerStateSeconds,
  filter: (_, status) => status === "paused",
  fn: (state) => {
    localStorage.setItem(localStorageKey, state.toString());
  },
});
