describe("Hello World!", () => {
  test("Should return Hello World!", () => {
    expect((() => "Hello World!")()).toBe("Hello World!");
  });
})