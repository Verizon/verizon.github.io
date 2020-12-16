export default function isStyledComponent(target) {
  return (
    typeof target === 'function' && typeof target.styledComponentId === 'string'
  );
}
