async function deleteCar(id) {
  try {
    const response = await fetch('/products', {
      method: 'delete',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({ id }),
    })
    if (response.ok) {
      window.location.reload()
    }
  } catch (error) {
    console.log(error)
  }
}