export async function getServerSideProps(context) {
    return {
        props: {
            context: context
        }
    }
}

export default function Report({context}) {}