import Link from "next/link";

const BreadcrumbItem = ({ children, href, ...props }) => {
  return (
    <li {...props}>
      <Link href={href} passHref>
        <a>{children}</a>
      </Link>
    </li>
  );
};

export default BreadcrumbItem;
