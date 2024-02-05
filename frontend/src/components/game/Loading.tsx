import Swal from "sweetalert2"

const Loading = ({ isLoading }: {isLoading: boolean}) => {
  if (isLoading) {
    Swal.fire({
      didOpen: () => {
        Swal.showLoading()
      },
      allowOutsideClick: false,
      showConfirmButton: false,
      allowEscapeKey: false,
      allowEnterKey: false,
      customClass: {
        loader: 'h-[100px] w-[100px]',
        popup: 'bg-transparent',
      },
    })
  }
  else {
    Swal.close()
  }
  return (
    <div>
    </div>
  )
}

export default Loading;

