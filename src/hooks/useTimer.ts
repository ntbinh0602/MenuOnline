import {useCallback, useEffect, useRef, useState} from 'react';
import {AppState, AppStateStatus} from 'react-native';

export const useTimer = (
  seconds: number,
  timerIntervalInMilliseconds: number = 1000,
  onTimerFinished: () => void,
) => {
  const [appState, setAppState] = useState(AppState.currentState);
  const [counter, setCounter] = useState(seconds);

  const timer = useRef<ReturnType<typeof setInterval>>();
  const timerTimeToFinish = useRef<number>(0);

  const setTimerFinishTime = useCallback(() => {
    timerTimeToFinish.current = Date.now() + seconds * 1000;
  }, [seconds]);

  const updateCounter = useCallback(() => {
    setCounter(prevCounter => prevCounter - 1);
  }, []);

  const startTimer = useCallback(() => {
    timer.current = setInterval(updateCounter, timerIntervalInMilliseconds);
  }, [updateCounter, timerIntervalInMilliseconds]);

  const stopTimer = useCallback(() => {
    timer.current && clearInterval(timer.current);
  }, []);

  const resetTimer = useCallback(() => {
    stopTimer();
    setCounter(seconds);
    setTimerFinishTime();
    startTimer();
  }, [seconds, startTimer, stopTimer, setTimerFinishTime]);

  const getRemainingTime = useCallback(() => {
    const time = Math.round((timerTimeToFinish.current - Date.now()) / 1000);
    return {time, isValid: time > 0};
  }, []);

  const restartTimer = useCallback(() => {
    const {time, isValid} = getRemainingTime();
    setCounter(isValid ? time : 0);
    isValid && startTimer();
  }, [getRemainingTime, startTimer]);

  useEffect(() => {
    setTimerFinishTime();
    startTimer();
    return stopTimer;
  }, [startTimer, setTimerFinishTime, stopTimer]);

  useEffect(() => {
    if (counter <= 0) {
      stopTimer();
      onTimerFinished?.();
    }
  }, [counter, onTimerFinished, stopTimer]);

  const onAppStateChange = useCallback(
    (nextAppState: AppStateStatus) => {
      if (appState === 'active' && nextAppState.match(/inactive|background/)) {
        stopTimer();
      } else if (
        appState.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        restartTimer();
      }

      setAppState(nextAppState);
    },
    [appState, restartTimer, stopTimer],
  );

  useEffect(() => {
    const appStateChangeListener = AppState.addEventListener(
      'change',
      onAppStateChange,
    );
    return appStateChangeListener.remove;
  }, [onAppStateChange]);

  return {counter, resetTimer};
};
