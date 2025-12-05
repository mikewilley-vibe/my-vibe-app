type VibeCardProps = {
  title: string;
  emoji: string;
  message: string;
};

export default function VibeCard(props: { title: string; emoji: string; message: string }) {
  return (
    <article
      className="
        bg-white rounded-2xl shadow-md p-6
        transition-transform transition-shadow duration-150
        hover:-translate-y-1 hover:shadow-lg
      "
    >
      <div className="text-3xl mb-2">{props.emoji}</div>
      <h3 className="text-lg font-semibold mb-1">{props.title}</h3>
      <p className="text-gray-600 text-sm">{props.message}</p>
    </article>
  );
}