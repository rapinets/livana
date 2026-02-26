class RequestManager {
  static async deleteRequest(route, id) {
    const response = await fetch(route, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Надсилаємо та отримуємо cookies
      body: JSON.stringify({ id }),
    })
    const data = await response.json()

    // Оновлення поточного вікна без використання кешу
    window.location.reload(true)
    return data
  }

  static handleFileSelect(event, imgSelector) {
    const file = event.target.files[0]
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = function (e) {
        const imgElement = document.querySelector(imgSelector)
        imgElement.src = e.target.result
      }
      reader.readAsDataURL(file)
    }
  }
}