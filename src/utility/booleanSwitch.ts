/**
 * Helps with the common pattern of checking a boolean value and calling one of two callbacks using the same data, but different callbacks
 *
 * @param value The value to be checked
 * @param data Data to be passed to the callback
 * @param trueCallback If the value is true, this callback will be called
 * @param falseCallback If the value is false, this callback will be called
 * @returns {ReturnT} The return value of the callback that was called
 */
export default function booleanSwitch<DataT, ReturnTrueT, ReturnFalseT>(
  value: boolean,
  data: DataT,
  trueCallback: (data: DataT) => ReturnTrueT,
  falseCallback: (data: DataT) => ReturnFalseT
): ReturnTrueT | ReturnFalseT {
  return value ? trueCallback(data) : falseCallback(data);
}