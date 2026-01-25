function calculateAge() {
  const dobInput = document.getElementById("dob").value;
  const resultBox = document.getElementById("resultBox");
  const ageOutput = document.getElementById("age");

  if (!dobInput) {
    alert("Please select your date of birth.");
    return;
  }

  const dob = new Date(dobInput);
  const today = new Date();

  let years = today.getFullYear() - dob.getFullYear();
  let months = today.getMonth() - dob.getMonth();
  let days = today.getDate() - dob.getDate();

  if (days < 0) {
    months--;
    const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
    days += lastMonth.getDate();
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  ageOutput.textContent = `${years} years, ${months} months, ${days} days`;
  resultBox.style.display = "block";
}
